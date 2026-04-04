-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "housing" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "housingType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "transport" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "city" TEXT NOT NULL DEFAULT 'unknown',
    "cities" TEXT NOT NULL DEFAULT '[]',
    "jobTypes" TEXT,
    "salaryRange" TEXT,
    "agencyType" TEXT NOT NULL DEFAULT 'general-staffing',
    "jobFocus" TEXT NOT NULL DEFAULT '[]',
    "transparencyScore" INTEGER NOT NULL DEFAULT 0,
    "accommodation" TEXT NOT NULL DEFAULT 'unknown',
    "supportedCities" TEXT NOT NULL DEFAULT '[]',
    "canonicalId" TEXT,
    "aliases" TEXT NOT NULL DEFAULT '[]',
    "duplicateCount" INTEGER NOT NULL DEFAULT 1,
    "confidenceScore" INTEGER NOT NULL DEFAULT 100,
    "sourceUrl" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "lastCheckedAt" TIMESTAMP(3),
    "housingVerification" TEXT,
    "transportVerification" TEXT,
    "webPages" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_listings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "salaryMin" DOUBLE PRECISION NOT NULL,
    "salaryMax" DOUBLE PRECISION NOT NULL,
    "housing" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "transport" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "sourceUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "internalNotes" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderatedBy" TEXT,
    "reviewType" TEXT NOT NULL DEFAULT 'ANONYMOUS',
    "workerStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "experiencePeriod" TEXT,
    "jobType" TEXT,
    "jobTitle" TEXT,
    "city" TEXT,
    "title" TEXT,
    "overallRating" INTEGER NOT NULL DEFAULT 3,
    "salaryRating" INTEGER NOT NULL DEFAULT 3,
    "housingRating" INTEGER,
    "managementRating" INTEGER NOT NULL DEFAULT 3,
    "contractClarityRating" INTEGER NOT NULL DEFAULT 3,
    "transportRating" INTEGER,
    "salaryAccuracyRating" INTEGER,
    "accommodationProvided" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "roomType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "weeklyRent" DOUBLE PRECISION,
    "peopleInHouse" INTEGER,
    "wouldRecommend" TEXT NOT NULL DEFAULT 'UNSURE',
    "comment" TEXT,
    "issueTags" TEXT NOT NULL DEFAULT '[]',
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "sourceType" TEXT NOT NULL DEFAULT 'WORKER_REPORTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_comments" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notifications" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_mentions" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "extractedName" TEXT NOT NULL,
    "detectionMethod" TEXT NOT NULL DEFAULT 'text_extraction',
    "confidence" INTEGER NOT NULL DEFAULT 50,
    "autoCreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_photos" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_reports" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "hourlyPay" DOUBLE PRECISION NOT NULL,
    "housing" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_reports" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountMissing" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agency_scores" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agency_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourcePage" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'general_apply',
    "sourceSlug" TEXT,
    "sourceLabel" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "whatsappSame" BOOLEAN NOT NULL DEFAULT false,
    "nationality" TEXT,
    "currentCountry" TEXT,
    "alreadyInNL" BOOLEAN,
    "preferredWorkType" TEXT,
    "preferredRegion" TEXT,
    "accommodationNeeded" BOOLEAN,
    "driversLicense" BOOLEAN,
    "canWorkWeekends" BOOLEAN,
    "experienceLevel" TEXT,
    "availableFrom" TIMESTAMP(3),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "assignedTo" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "assignedAgencies" TEXT NOT NULL DEFAULT '[]',
    "sentAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "workerStartDate" TIMESTAMP(3),
    "payoutAmount" DOUBLE PRECISION,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_experiences" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agencyName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "agreedGross" TEXT,
    "actualKeep" TEXT,
    "hasHousing" BOOLEAN NOT NULL DEFAULT false,
    "housingRating" INTEGER,
    "salaryAccurate" BOOLEAN NOT NULL DEFAULT false,
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "submittedAt" TEXT,

    CONSTRAINT "worker_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_sends" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT NOT NULL,
    "agencySlug" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "agencyEmail" TEXT,
    "method" TEXT NOT NULL DEFAULT 'email',
    "status" TEXT NOT NULL DEFAULT 'sent',
    "errorMsg" TEXT,
    "emailSubject" TEXT,
    "emailBody" TEXT,

    CONSTRAINT "lead_sends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agency_city_mentions" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "cityNormalized" TEXT NOT NULL,
    "cityDisplay" TEXT NOT NULL,
    "mentionCount" INTEGER NOT NULL DEFAULT 1,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agency_city_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agencies_slug_key" ON "agencies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "job_listings_slug_key" ON "job_listings"("slug");

-- CreateIndex
CREATE INDEX "job_listings_agencyId_idx" ON "job_listings"("agencyId");

-- CreateIndex
CREATE INDEX "job_listings_city_idx" ON "job_listings"("city");

-- CreateIndex
CREATE INDEX "job_listings_jobType_idx" ON "job_listings"("jobType");

-- CreateIndex
CREATE INDEX "job_listings_isActive_idx" ON "job_listings"("isActive");

-- CreateIndex
CREATE INDEX "reviews_agencyId_idx" ON "reviews"("agencyId");

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE INDEX "reviews_isPublished_idx" ON "reviews"("isPublished");

-- CreateIndex
CREATE INDEX "reviews_overallRating_idx" ON "reviews"("overallRating");

-- CreateIndex
CREATE INDEX "reviews_lastActivityAt_idx" ON "reviews"("lastActivityAt");

-- CreateIndex
CREATE INDEX "review_comments_reviewId_idx" ON "review_comments"("reviewId");

-- CreateIndex
CREATE INDEX "review_comments_createdAt_idx" ON "review_comments"("createdAt");

-- CreateIndex
CREATE INDEX "admin_notifications_isRead_idx" ON "admin_notifications"("isRead");

-- CreateIndex
CREATE INDEX "admin_notifications_createdAt_idx" ON "admin_notifications"("createdAt");

-- CreateIndex
CREATE INDEX "review_mentions_reviewId_idx" ON "review_mentions"("reviewId");

-- CreateIndex
CREATE INDEX "review_mentions_agencyId_idx" ON "review_mentions"("agencyId");

-- CreateIndex
CREATE UNIQUE INDEX "review_mentions_reviewId_agencyId_key" ON "review_mentions"("reviewId", "agencyId");

-- CreateIndex
CREATE INDEX "review_photos_reviewId_idx" ON "review_photos"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "agency_scores_agencyId_key" ON "agency_scores"("agencyId");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- CreateIndex
CREATE INDEX "leads_sourceType_idx" ON "leads"("sourceType");

-- CreateIndex
CREATE INDEX "leads_accommodationNeeded_idx" ON "leads"("accommodationNeeded");

-- CreateIndex
CREATE INDEX "worker_experiences_agencyName_idx" ON "worker_experiences"("agencyName");

-- CreateIndex
CREATE INDEX "worker_experiences_createdAt_idx" ON "worker_experiences"("createdAt");

-- CreateIndex
CREATE INDEX "lead_sends_leadId_idx" ON "lead_sends"("leadId");

-- CreateIndex
CREATE INDEX "agency_city_mentions_agencyId_idx" ON "agency_city_mentions"("agencyId");

-- CreateIndex
CREATE INDEX "agency_city_mentions_mentionCount_idx" ON "agency_city_mentions"("mentionCount");

-- CreateIndex
CREATE UNIQUE INDEX "agency_city_mentions_agencyId_cityNormalized_key" ON "agency_city_mentions"("agencyId", "cityNormalized");

-- AddForeignKey
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_mentions" ADD CONSTRAINT "review_mentions_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_mentions" ADD CONSTRAINT "review_mentions_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_photos" ADD CONSTRAINT "review_photos_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_reports" ADD CONSTRAINT "salary_reports_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_scores" ADD CONSTRAINT "agency_scores_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_sends" ADD CONSTRAINT "lead_sends_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_city_mentions" ADD CONSTRAINT "agency_city_mentions_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

