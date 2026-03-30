/**
 * POST /api/reviews
 * Accepts multipart/form-data with all review fields + optional photo files.
 * Saves review to database via Prisma ORM. Photos saved to /public/uploads/reviews/.
 * Reviews are published immediately on submit: status='PUBLISHED', isPublished=true.
 *
 * GET /api/reviews?agencySlug=<slug>
 * Returns only PUBLISHED reviews with their photos.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// ─── Slug generator (for worker-reported agencies) ────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")    // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")       // keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-")               // spaces → hyphens
    .replace(/-+/g, "-")                // collapse consecutive hyphens
    .slice(0, 80);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_PHOTOS    = 6;
const ALLOWED_MIME  = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXT   = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const UPLOAD_REL    = "public/uploads/reviews";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase();
  return `${crypto.randomBytes(8).toString("hex")}${ALLOWED_EXT.has(ext) ? ext : ".jpg"}`;
}

function int(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = parseInt(String(v), 10);
  return isNaN(n) ? null : n;
}

function flt(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
}

function str(v: FormDataEntryValue | null, max: number): string | null {
  if (!v || typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t.slice(0, max) : null;
}

function pick<T extends string>(v: FormDataEntryValue | null, allowed: readonly T[], fallback: T): T {
  if (typeof v === "string" && (allowed as readonly string[]).includes(v)) return v as T;
  return fallback;
}

function validRating(n: number | null): boolean {
  return n !== null && Number.isInteger(n) && n >= 1 && n <= 5;
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: NextRequest) {
  try {
    let fd: FormData;
    try { fd = await req.formData(); }
    catch { return NextResponse.json({ error: "Invalid form data" }, { status: 400 }); }

    // ── Agency lookup (existing slug) or create (new name) ────────────────────
    const agencySlugInput = str(fd.get("agencySlug"), 100);
    const agencyNameInput = str(fd.get("agencyName"), 200);

    let agencyId: string;
    let resolvedSlug: string;

    if (agencySlugInput) {
      // Caller selected an existing agency by slug
      const found = await db.agency.findUnique({
        where:  { slug: agencySlugInput },
        select: { id: true, slug: true },
      });
      if (!found) return NextResponse.json({ error: "Agency not found" }, { status: 404 });
      agencyId      = found.id;
      resolvedSlug  = found.slug;

    } else if (agencyNameInput) {
      // Caller typed a free-form agency name — find or create
      const normalized = agencyNameInput.trim();

      // 1. Try exact name match (case-insensitive)
      let found = await db.agency.findFirst({
        where:  { name: { equals: normalized, mode: "insensitive" } },
        select: { id: true, slug: true },
      });

      // 2. Try contains match as fuzzy fallback
      if (!found) {
        found = await db.agency.findFirst({
          where:  { name: { contains: normalized, mode: "insensitive" } },
          select: { id: true, slug: true },
        });
      }

      // 3. Create a new worker-reported agency
      if (!found) {
        const baseSlug = generateSlug(normalized) || `agency-${Date.now()}`;
        const existing = await db.agency.findUnique({ where: { slug: baseSlug }, select: { id: true } });
        const finalSlug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

        found = await db.agency.create({
          data: {
            name:            normalized,
            slug:            finalSlug,
            sourceType:      "WORKER_REPORTED",
            confidenceScore: 30,
          },
          select: { id: true, slug: true },
        });
      }

      agencyId     = found.id;
      resolvedSlug = found.slug;

    } else {
      return NextResponse.json({ error: "agencySlug or agencyName is required" }, { status: 400 });
    }

    // ── Required ratings ───────────────────────────────────────────────────────
    const salaryRating          = int(fd.get("salaryRating"));
    const managementRating      = int(fd.get("managementRating"));
    const contractClarityRating = int(fd.get("contractClarityRating"));

    if (!validRating(salaryRating))          return NextResponse.json({ error: "salaryRating must be 1–5" },          { status: 400 });
    if (!validRating(managementRating))      return NextResponse.json({ error: "managementRating must be 1–5" },      { status: 400 });
    if (!validRating(contractClarityRating)) return NextResponse.json({ error: "contractClarityRating must be 1–5" }, { status: 400 });

    // ── Optional ratings ───────────────────────────────────────────────────────
    const hrRaw  = int(fd.get("housingRating"));
    const trRaw  = int(fd.get("transportRating"));
    const sarRaw = int(fd.get("salaryAccuracyRating"));
    const housingRating       = hrRaw  !== null && validRating(hrRaw)  ? hrRaw  : null;
    const transportRating     = trRaw  !== null && validRating(trRaw)  ? trRaw  : null;
    const salaryAccuracyRating = sarRaw !== null && validRating(sarRaw) ? sarRaw : null;

    // ── Overall rating (computed if not provided) ──────────────────────────────
    const rawOverall = int(fd.get("overallRating"));
    const computed = (() => {
      const vals = [salaryRating!, managementRating!, contractClarityRating!, ...(housingRating != null ? [housingRating] : [])];
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    })();
    const overallRating = rawOverall !== null && validRating(rawOverall) ? rawOverall : computed;

    // ── Text & enum-equivalent string fields ───────────────────────────────────
    const title            = str(fd.get("title"),            120);
    const comment          = str(fd.get("comment"),          4000);
    const jobType          = str(fd.get("jobType"),           80);
    const jobTitle         = str(fd.get("jobTitle"),          80);
    const city             = str(fd.get("city"),              80);
    const experiencePeriod = str(fd.get("experiencePeriod"), 20);

    const workerStatus          = pick(fd.get("workerStatus"),          ["CURRENT","FORMER","UNKNOWN"]   as const, "UNKNOWN");
    const accommodationProvided = pick(fd.get("accommodationProvided"), ["YES","NO","UNKNOWN"]           as const, "UNKNOWN");
    const roomType              = pick(fd.get("roomType"),              ["PRIVATE","SHARED","UNKNOWN"]   as const, "UNKNOWN");
    const wouldRecommend        = pick(fd.get("wouldRecommend"),        ["YES","NO","UNSURE"]            as const, "UNSURE");
    const reviewType            = pick(fd.get("reviewType"),            ["ANONYMOUS","VERIFIED_WORKER"]  as const, "ANONYMOUS");

    const weeklyRent    = flt(fd.get("weeklyRent"));
    const peopleInHouse = int(fd.get("peopleInHouse"));

    // ── Create review in database ──────────────────────────────────────────────
    const review = await db.review.create({
      data: {
        agencyId,
        reviewType,
        workerStatus,
        experiencePeriod,
        jobType,
        jobTitle,
        city,
        title,
        overallRating,
        salaryRating,
        housingRating,
        managementRating,
        contractClarityRating,
        transportRating,
        salaryAccuracyRating,
        accommodationProvided,
        roomType,
        weeklyRent,
        peopleInHouse,
        wouldRecommend,
        comment,
        issueTags:         JSON.stringify([]),
        verificationStatus: "WORKER_REPORTED",
        sourceType:         "WORKER_REPORTED",
        status:             "PUBLISHED",
        isPublished:        true,
      },
    });

    // ── Process uploaded photos ────────────────────────────────────────────────
    const photoFiles = (fd.getAll("photos") as File[])
      .filter((f) => f instanceof File && f.size > 0)
      .slice(0, MAX_PHOTOS);

    if (photoFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), UPLOAD_REL);
      await mkdir(uploadDir, { recursive: true });

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const mime = file.type.toLowerCase();
        if (!ALLOWED_MIME.has(mime)) continue;
        if (file.size > MAX_FILE_SIZE) continue;

        const filename  = `${review.id}-${i}-${safeName(file.name)}`;
        const absPath   = path.join(uploadDir, filename);
        const publicUrl = `/uploads/reviews/${filename}`;

        await writeFile(absPath, Buffer.from(await file.arrayBuffer()));

        await db.reviewPhoto.create({
          data: {
            reviewId:  review.id,
            fileUrl:   publicUrl,
            fileName:  filename,
            fileType:  mime,
            fileSize:  file.size,
            sortOrder: i,
          },
        });
      }
    }

    return NextResponse.json({ success: true, reviewId: review.id, agencySlug: resolvedSlug }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/reviews]", error);
    return NextResponse.json({ error: "Failed to submit review. Please try again." }, { status: 500 });
  }
}

// ─── GET /api/reviews — public, published only ────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agencySlug = searchParams.get("agencySlug");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 50);

    if (!agencySlug) return NextResponse.json({ error: "agencySlug is required" }, { status: 400 });

    const agency = await db.agency.findUnique({ where: { slug: agencySlug }, select: { id: true } });
    if (!agency) return NextResponse.json({ error: "Agency not found" }, { status: 404 });

    const reviews = await db.review.findMany({
      where: {
        agencyId:    agency.id,
        isPublished: true,
        status:      "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        photos: {
          select:  { id: true, fileUrl: true, fileType: true, caption: true, sortOrder: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[GET /api/reviews]", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
