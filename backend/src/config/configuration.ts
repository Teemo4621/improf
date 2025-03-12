import { AppConfig } from "./dto/config.dto";

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),

  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKENJWT_SECRET || '',
    accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '1h',

    refreshTokenSecret: process.env.REFRESH_TOKENJWT_SECRET || '',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '48h',
  },

  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.DISCORD_CLIENT_REDIRECT || '',
    scope: process.env.DISCORD_CLIENT_SCOPE || 'email, identify, guilds',
  },
});
