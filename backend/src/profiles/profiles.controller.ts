import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthRequest } from 'src/types/express';
import { ResponseService } from 'src/common/services/response.service';
import { UserService } from 'src/users/user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express'; // Import Response from express

@Controller('api/v1/profiles')
export class ProfilesController {
    constructor(
        private readonly profileService: ProfilesService,
        private readonly userService: UserService,
        private readonly responseService: ResponseService,
    ) {}

    @Get(':username')
    async getProfile(@Param('username') username: string) {
        if (!username)
            return this.responseService.BadRequestResponse('Bad request');

        const user = await this.userService.findUserByUsername({ username });
        if (!user)
            return this.responseService.NotFoundResponse('User not found');
        if (!user.profile_created)
            return this.responseService.BadRequestResponse(
                'User not create profile',
            );

        const profile = await this.profileService.getProfileByUserId(user.id);
        if (!profile)
            return this.responseService.NotFoundResponse('Profile not found');

        return this.responseService.OkResponse({ profile });
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'profile_image', maxCount: 1 },
                { name: 'banner_image', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, callback) => {
                        const folder =
                            file.fieldname === 'profile_image'
                                ? 'uploads/profiles'
                                : 'uploads/banners';
                        callback(null, folder);
                    },
                    filename: (req, file, callback) => {
                        const uniqueId = uuidv4();
                        const ext = extname(file.originalname);
                        const allowedExtensions = [
                            '.jpg',
                            '.jpeg',
                            '.png',
                            '.gif',
                        ];

                        if (!allowedExtensions.includes(ext.toLowerCase())) {
                            return callback(new Error('Invalid file type'), '');
                        }

                        callback(null, `${file.fieldname}-${uniqueId}${ext}`);
                    },
                }),
            },
        ),
    )
    async createProfile(
        @Req() req: AuthRequest,
        @Body() profile: CreateProfileDto,
        @UploadedFiles()
        files: {
            profile_image: Express.Multer.File[];
            banner_image: Express.Multer.File[];
        },
    ) {
        try {
            if (!req.user)
                return this.responseService.UnauthorizedResponse(
                    'User not login',
                );

            if (
                !profile.name ||
                !profile.gender ||
                !profile.about ||
                !profile.user_id ||
                !profile.theme
            ) {
                return this.responseService.BadRequestResponse('Bad request');
            }

            if (Number(profile.user_id) != req.user._id)
                return this.responseService.ServerErrorResponse(
                    'User ID mismatch',
                );

            const user = await this.userService.findUserById({
                id: Number(profile.user_id),
            });
            if (!user)
                return this.responseService.NotFoundResponse('User not found');
            if (user.profile_created)
                return this.responseService.BadRequestResponse('Bad request');

            const profile_image = files.profile_image?.[0]?.filename;
            const banner_image = files.banner_image?.[0]?.filename;

            if (!profile_image || !banner_image)
                return this.responseService.BadRequestResponse('Bad request');
            const newProfile = await this.profileService.createProfile({
                ...profile,
                profile_image_url: profile_image
                    ? `/uploads/profiles/${profile_image}`
                    : '',
                banner_image_url: banner_image
                    ? `/uploads/banners/${banner_image}`
                    : '',
            });

            if (!newProfile)
                return this.responseService.ServerErrorResponse(
                    'Error creating profile',
                );

            return this.responseService.OkResponse({ profile: newProfile });
        } catch (error) {
            console.error(error);
            return this.responseService.ServerErrorResponse(
                error?.message ?? 'An unexpected error occurred',
            );
        }
    }

    @Post('update')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'profile_image', maxCount: 1 },
                { name: 'banner_image', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, callback) => {
                        const folder =
                            file.fieldname === 'profile_image'
                                ? 'uploads/profiles'
                                : 'uploads/banners';
                        callback(null, folder);
                    },
                    filename: (req, file, callback) => {
                        const uniqueId = uuidv4();
                        const ext = extname(file.originalname);
                        const allowedExtensions = [
                            '.jpg',
                            '.jpeg',
                            '.png',
                            '.gif',
                        ];

                        if (!allowedExtensions.includes(ext.toLowerCase())) {
                            return callback(new Error('Invalid file type'), '');
                        }

                        callback(null, `${file.fieldname}-${uniqueId}${ext}`);
                    },
                }),
            },
        ),
    )
    async updateProfile(
        @Req() req: AuthRequest,
        @Body() profile: CreateProfileDto,
        @UploadedFiles()
        files: {
            profile_image?: Express.Multer.File[];
            banner_image?: Express.Multer.File[];
        },
    ) {
        try {
            if (!req.user)
                return this.responseService.UnauthorizedResponse(
                    'User not login',
                );

            const user = await this.userService.findUserById({
                id: Number(req.user._id),
            });
            if (!user)
                return this.responseService.NotFoundResponse('User not found');
            if (!user.profile_created)
                return this.responseService.BadRequestResponse(
                    'Profile not created',
                );
            if (Number(profile.user_id) != req.user._id)
                return this.responseService.ServerErrorResponse(
                    'User ID mismatch',
                );
            const existingProfile =
                await this.profileService.getProfileByUserId(user.id);
            if (!existingProfile)
                return this.responseService.NotFoundResponse(
                    'Profile not found',
                );

            const profile_image = files.profile_image?.[0]?.filename;
            const banner_image = files.banner_image?.[0]?.filename;

            const updatedProfile = await this.profileService.updateProfile({
                ...profile,
                profile_image_url: profile_image
                    ? `/uploads/profiles/${profile_image}`
                    : existingProfile.profile_image_url || '',
                banner_image_url: banner_image
                    ? `/uploads/banners/${banner_image}`
                    : existingProfile.banner_image_url || '',
            });

            if (!updatedProfile)
                return this.responseService.ServerErrorResponse(
                    'Error updating profile',
                );
            return this.responseService.OkResponse({ profile: updatedProfile });
        } catch (error) {
            console.error(error);
            return this.responseService.ServerErrorResponse(
                error?.message ?? 'An unexpected error occurred',
            );
        }
    }
}
