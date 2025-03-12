export interface JwtConfig {
    accessTokenSecret: string;
    accessTokenExpiration: string;
    refreshTokenSecret: string;
    refreshTokenExpiration: string;
}

export interface DiscordConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string;
}

export interface AppConfig {
    port: number;
    jwt: JwtConfig;
    discord: DiscordConfig;
}