/**
 * Admin — Auto-created agencies
 *
 * Lists all Agency records that were created automatically by the
 * agency-extraction pipeline (sourceType = "WORKER_REPORTED" and created
 * via a ReviewMention.autoCreated = true).
 *
 * Allows an admin to:
 *  - See which review triggered the creation
 *  - Check the confidence + detection method
 *  - Link through to the agency page for manual review/editing
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export const dynamic = "force-dynamic";

export default async function AutoAgenciesPage() {
  // Agencies that were auto-created by extraction (have at least one mention with autoCreated=true)
  const autoAgencies = await db.agency.findMany({
    where: {
      sourceType: "WORKER_REPORTED",
      mentions: { some: { autoCreated: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id:              true,
      name:            true,
      slug:            true,
      confidenceScore: true,
      createdAt:       true,
      mentions: {
        where:   { autoCreated: true },
        take:    5,
        orderBy: { confidence: "desc" },
        select: {
          id:              true,
          extractedName:   true,
          detectionMethod: true,
          confidence:      true,
          review: {
            select: {
              id:      true,
              comment: true,
              agency:  { select: { slug: true, name: true } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Auto-created Agencies</h1>
        <p className="text-sm text-gray-500">
          Agencies discovered automatically from review text. Review these to confirm, merge, or delete duplicates.
        </p>
      </div>

      {autoAgencies.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 px-6 py-10 text-center text-gray-500 text-sm">
          No auto-created agencies yet. They appear here after workers submit reviews mentioning other agencies.
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">{autoAgencies.length} auto-created agencies</p>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {autoAgencies.map((agency: any) => (
            <div
              key={agency.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900">{agency.name}</h2>
                    <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">
                      confidence {agency.confidenceScore}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{agency.slug}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {new Date(agency.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <Link
                  href={`/agency/${agency.slug}`}
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline shrink-0"
                >
                  View page →
                </Link>
              </div>

              {/* Source mentions */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {agency.mentions.map((m: any) => (
                <div key={m.id} className="bg-gray-50 rounded-lg px-4 py-3 text-xs space-y-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-700">Extracted: &quot;{m.extractedName}&quot;</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{m.detectionMethod.replace(/_/g, " ")}</span>
                    <span className="text-gray-400">·</span>
                    <span className={`font-semibold ${m.confidence >= 70 ? "text-green-600" : m.confidence >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                      {m.confidence}% confidence
                    </span>
                  </div>
                  {m.review && (
                    <div>
                      <span className="text-gray-400">From review of </span>
                      <Link href={`/agency/${m.review.agency.slug}`} target="_blank" className="text-blue-600 hover:underline">
                        {m.review.agency.name}
                      </Link>
                      {m.review.comment && (
                        <p className="mt-1 text-gray-500 italic line-clamp-2">
                          &ldquo;{m.review.comment.slice(0, 200)}{m.review.comment.length > 200 ? "…" : ""}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">← Back to admin</Link>
      </div>
    </div>
  );
}
