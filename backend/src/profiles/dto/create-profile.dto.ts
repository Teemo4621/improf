export class CreateProfileDto {
    readonly id: number;
    readonly user_id: number;
    readonly name: string;
    readonly status?: string | null;
    readonly birthdate: string;
    readonly gender: string;
    readonly about: string;
    readonly theme: string;
    readonly profile_image_url?: string | null;
    readonly banner_image_url?: string | null;
    readonly facebook_url?: string | null;
    readonly twitter_url?: string | null;
    readonly youtube_url?: string | null;
    readonly twitch_url?: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
