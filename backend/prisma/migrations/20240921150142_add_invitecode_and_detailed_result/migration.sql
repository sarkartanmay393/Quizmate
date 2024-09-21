/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailed` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "detailed" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "InviteCode" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_quizId_key" ON "InviteCode"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_inviteCode_key" ON "Quiz"("inviteCode");

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
