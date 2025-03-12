/*
  Warnings:

  - You are about to drop the `BannerImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BannerImages" DROP CONSTRAINT "BannerImages_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "ProfileImages" DROP CONSTRAINT "ProfileImages_profile_id_fkey";

-- DropTable
DROP TABLE "BannerImages";

-- DropTable
DROP TABLE "ProfileImages";
