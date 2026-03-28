/**
 * leadClient.ts
 *
 * Type-safe wrapper around the Lead + LeadSend Prisma models.
 * The Prisma client types are not yet regenerated in this build environment.
 * This module provides the correct typings for full type safety.
 *
 * When you deploy and run `prisma generate`, these types will be identical
 * to `prisma.lead` — you can then import directly from @prisma/client.
 */

import { prisma } from "@/lib/prisma";

// ─── Lead model types ──────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"                   // submitted — awaiting first review
  | "reviewed"              // admin viewed the profile — no action yet
  | "waiting_for_match"     // in the candidate pool — no match yet
  | "potential_fit"         // flagged as potential fit for a specific role
  | "agency_contact_pending"// admin is reaching out to an agency
  | "approved"              // approved to be forwarded to an agency
  | "sent"                  // dispatched to one or more agencies
  | "converted"             // lead became a confirmed placement
  | "rejected"              // not a fit or withdrawn
  | "contacted";            // legacy: admin contacted the lead directly

export type LeadSourceType =
  | "jobs_with_housing"
  | "job_page"
  | "agency_page"
  | "general_apply";

export interface Lead {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  sourcePage: string;
  sourceType: LeadSourceType;
  sourceSlug: string | null;
  sourceLabel: string | null;

  fullName: string;
  phone: string;
  email: string | null;
  whatsappSame: boolean;

  nationality: string | null;
  currentCountry: string | null;
  alreadyInNL: boolean | null;

  preferredWorkType: string | null;
  preferredRegion: string | null;
  accommodationNeeded: boolean | null;
  driversLicense: boolean | null;
  canWorkWeekends: boolean | null;
  experienceLevel: string | null;
  availableFrom: Date | null;
  notes: string | null;

  status: LeadStatus;
  tags: string[];
  assignedTo: string | null;
  lastContactedAt: Date | null;
  internalNotes: string | null;

  assignedAgencies: string[];
  sentAt: Date | null;
}

export interface LeadSend {
  id: string;
  createdAt: Date;
  leadId: string;
  agencySlug: string;
  agencyName: string;
  agencyEmail: string | null;
  method: string;
  status: string;
  errorMsg: string | null;
  emailSubject: string | null;
  emailBody: string | null;
}

export interface LeadCreateInput {
  sourcePage: string;
  sourceType: LeadSourceType;
  sourceSlug?: string;
  sourceLabel?: string;
  fullName: string;
  phone: string;
  email?: string;
  whatsappSame?: boolean;
  nationality?: string;
  currentCountry?: string;
  alreadyInNL?: boolean;
  preferredWorkType?: string;
  preferredRegion?: string;
  accommodationNeeded?: boolean;
  driversLicense?: boolean;
  canWorkWeekends?: boolean;
  experienceLevel?: string;
  availableFrom?: Date;
  notes?: string;
  status?: LeadStatus;
  tags?: string[];
  assignedAgencies?: string[];
}

export interface LeadUpdateInput {
  status?: LeadStatus;
  internalNotes?: string;
  assignedTo?: string | null;
  tags?: string[];
  lastContactedAt?: Date;
  assignedAgencies?: string[];
  sentAt?: Date;
}

export interface LeadWhereInput {
  status?: LeadStatus;
  sourceType?: LeadSourceType;
  accommodationNeeded?: boolean;
  preferredWorkType?: string;
  OR?: Array<{
    fullName?: { contains: string };
    email?: { contains: string };
    phone?: { contains: string };
  }>;
}

export interface LeadSendCreateInput {
  leadId: string;
  agencySlug: string;
  agencyName: string;
  agencyEmail?: string;
  method?: string;
  status?: string;
  errorMsg?: string;
  emailSubject?: string;
  emailBody?: string;
}

// ─── Delegate interfaces ───────────────────────────────────────────────────────

interface LeadFindManyArgs {
  where?: LeadWhereInput;
  orderBy?: { createdAt?: "asc" | "desc" };
  skip?: number;
  take?: number;
  select?: Partial<Record<keyof Lead, boolean>>;
  include?: { sends?: boolean };
}

interface LeadDelegate {
  create(args: { data: LeadCreateInput }): Promise<Lead>;
  findUnique(args: { where: { id: string }; include?: { sends?: boolean } }): Promise<(Lead & { sends?: LeadSend[] }) | null>;
  findMany(args: LeadFindManyArgs): Promise<Partial<Lead>[]>;
  update(args: { where: { id: string }; data: LeadUpdateInput }): Promise<Lead>;
  count(args: { where?: LeadWhereInput }): Promise<number>;
}

interface LeadSendDelegate {
  create(args: { data: LeadSendCreateInput }): Promise<LeadSend>;
  findMany(args: { where: { leadId: string }; orderBy?: { createdAt?: "asc" | "desc" } }): Promise<LeadSend[]>;
}

// ─── Typed delegates ───────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = prisma as unknown as Record<string, any>;

export const leadDelegate     = client["lead"]     as LeadDelegate;
export const leadSendDelegate = client["leadSend"] as LeadSendDelegate;
