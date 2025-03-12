-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "profile_image_url" TEXT,
    "banner_image_url" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "youtube_url" TEXT,
    "twitch_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileImages" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerImages" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_user_id_key" ON "Profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImages_profile_id_key" ON "ProfileImages"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "BannerImages_profile_id_key" ON "BannerImages"("profile_id");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileImages" ADD CONSTRAINT "ProfileImages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerImages" ADD CONSTRAINT "BannerImages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
