/*
  Warnings:

  - Added the required column `user_discord_id` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "user_discord_id" TEXT NOT NULL;
