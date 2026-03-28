/**
 * prisma/seed-leads.ts — Seeds 2 test leads into the SQLite database.
 *
 * Run:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-leads.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test leads…");

  // Wipe existing test leads by checking for the specific phones
  // (idempotent — safe to re-run)
  await prisma.lead.deleteMany({
    where: { phone: { in: ["+48 601 234 567", "+40 721 987 654"] } },
  });

  const lead1 = await prisma.lead.create({
    data: {
      createdAt:           new Date("2024-12-15T10:30:00.000Z"),
      sourcePage:          "/jobs-with-accommodation",
      sourceType:          "jobs_with_housing",
      sourceLabel:         "Jobs With Housing page",
      fullName:            "Marek Kowalski",
      phone:               "+48 601 234 567",
      email:               "marek.kowalski@example.com",
      whatsappSame:        true,
      nationality:         "Polish",
      currentCountry:      "Poland",
      alreadyInNL:         false,
      preferredWorkType:   "logistics",
      preferredRegion:     "Amsterdam area",
      accommodationNeeded: true,
      driversLicense:      true,
      canWorkWeekends:     true,
      experienceLevel:     "some",
      availableFrom:       new Date("2025-01-15"),
      notes:               "Looking for warehouse work with housing included. Available from mid-January.",
      status:              "new",
      tags:                JSON.stringify(["with_housing"]),
      assignedAgencies:    JSON.stringify([]),
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      createdAt:           new Date("2024-12-14T14:15:00.000Z"),
      sourcePage:          "/",
      sourceType:          "general_apply",
      sourceLabel:         "Homepage CTA banner",
      fullName:            "Ana Popescu",
      phone:               "+40 721 987 654",
      email:               "ana.popescu@example.com",
      whatsappSame:        false,
      nationality:         "Romanian",
      currentCountry:      "Romania",
      alreadyInNL:         false,
      preferredWorkType:   "production",
      preferredRegion:     "Eindhoven area",
      accommodationNeeded: true,
      driversLicense:      false,
      canWorkWeekends:     false,
      experienceLevel:     "experienced",
      availableFrom:       new Date("2025-02-01"),
      notes:               "5 years food production experience. Need housing and non-weekend schedule.",
      status:              "new",
      tags:                JSON.stringify(["with_housing"]),
      assignedAgencies:    JSON.stringify([]),
    },
  });

  console.log(`✅ Created lead: ${lead1.fullName} (${lead1.id})`);
  console.log(`✅ Created lead: ${lead2.fullName} (${lead2.id})`);
  console.log("\n🎉 Lead seed complete. 2 test leads in the database.");
}

main()
  .catch((e) => { console.error("Fatal lead seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
