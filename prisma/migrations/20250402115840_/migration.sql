-- AlterTable
ALTER TABLE "CodeReviewRules" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CodeReviewComments" (
    "id" TEXT NOT NULL,
    "pullRequestId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CodeReviewComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeReviewComments_pullRequestId_idx" ON "CodeReviewComments"("pullRequestId");

-- CreateIndex
CREATE INDEX "CodeReviewRules_repoId_idx" ON "CodeReviewRules"("repoId");
