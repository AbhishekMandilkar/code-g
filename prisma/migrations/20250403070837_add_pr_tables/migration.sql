-- CreateTable
CREATE TABLE "CodeReviewPRs" (
    "id" TEXT NOT NULL,
    "pullRequestId" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeReviewPRs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeReviewPRs_repoId_idx" ON "CodeReviewPRs"("repoId");
