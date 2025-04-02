-- CreateTable
CREATE TABLE "CodeReviewRules" (
    "id" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,

    CONSTRAINT "CodeReviewRules_pkey" PRIMARY KEY ("id")
);
