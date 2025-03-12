export interface DiscordResponse {
    data: Data
    success: boolean
}

export interface Data {
    discord_user: DiscordUser
    activities: DiscordActivity[]
    discord_status: string
    active_on_discord_web: boolean
    active_on_discord_desktop: boolean
    active_on_discord_mobile: boolean
    listening_to_spotify: boolean
    spotify: DiscordActivitySpotify
}


export interface DiscordUser {
    id: string
    username: string
    avatar: string
    discriminator: string
    bot: boolean
    global_name: string
    display_name: string
    public_flags: number
}

export interface DiscordActivity {
    flags: number
    id: string
    name: string
    type: number
    state: string
    application_id?: string
    session_id: string
    details: string
    timestamps: Timestamps
    assets: Assets
    sync_id: string
    created_at: number
    party: Party
}

export interface Timestamps {
    start: number
    end: number
}

export interface Assets {
    large_image: string
    large_text: string
    small_image: string
    small_text: string
}

export interface Party {
    id: string
}

export interface DiscordActivitySpotify {
    timestamps: Timestamps2
    album: string
    album_art_url: string
    artist: string
    song: string
    track_id: string
}

export interface Timestamps2 {
    start: number
    end: number
}
