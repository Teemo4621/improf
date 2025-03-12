/*
  Warnings:

  - Added the required column `refresh_token` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "refresh_token" TEXT NOT NULL;
