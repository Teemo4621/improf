export interface formData {
    user_id: number;
    name: string;
    username?: string;
    user_discord_id?: string;
    status: string;
    birthdate: string | string[] | null;
    gender: string;
    about: string;
    profile_image_url: File | string | null;
    banner_image_url: File | string | null;
    theme: string;

    facebook_url: string | null;
    twitter_url: string | null;
    youtube_url: string | null;
    twitch_url: string | null;
}