import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) {}

    getProfileByUserId(id: number) {
        return this.prisma.profiles.findFirst({ where: { user_id: id } });
    }

    async updateProfile(profile: CreateProfileDto) {
        return this.prisma.profiles.update({
            where: { user_id: Number(profile.user_id) },
            data: {
                name: profile.name,
                birthdate: profile.birthdate,
                status: profile.status ?? null,
                gender: profile.gender,
                about: profile.about,
                theme: profile.theme,
                profile_image_url: profile.profile_image_url ?? null,
                banner_image_url: profile.banner_image_url ?? null,
                facebook_url: profile.facebook_url ?? null,
                twitter_url: profile.twitter_url ?? null,
                youtube_url: profile.youtube_url ?? null,
                twitch_url: profile.twitch_url ?? null,
            },
        });
    }

    async createProfile(profile: CreateProfileDto) {
        const user = await this.prisma.users.update({
            where: {
                id: Number(profile.user_id),
            },
            data: {
                profile_created: true,
            },
        });

        return this.prisma.profiles.create({
            data: {
                user_id: Number(profile.user_id),
                user_discord_id: user.discord_id,
                name: profile.name,
                birthdate: profile.birthdate ?? null,
                status: profile.status,
                gender: profile.gender,
                about: profile.about,
                theme: profile.theme,
                profile_image_url: profile.profile_image_url ?? null,
                banner_image_url: profile.banner_image_url ?? null,
                facebook_url: profile.facebook_url ?? null,
                twitter_url: profile.twitter_url ?? null,
                youtube_url: profile.youtube_url ?? null,
                twitch_url: profile.twitch_url ?? null,
            },
        });
    }
}
