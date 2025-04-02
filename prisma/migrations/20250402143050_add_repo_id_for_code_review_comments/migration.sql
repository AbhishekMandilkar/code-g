/*
  Warnings:

  - Added the required column `repoId` to the `CodeReviewComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruleId` to the `CodeReviewComments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeReviewComments" ADD COLUMN     "repoId" TEXT NOT NULL,
ADD COLUMN     "ruleId" TEXT NOT NULL;
