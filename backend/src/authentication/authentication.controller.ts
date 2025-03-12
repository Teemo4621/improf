import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthReqDiscordDto, AuthReqRefreshTokenDto } from "./dto/auth-discord.dto";
import { ResponseService } from "src/common/services/response.service";
import axios, { isAxiosError } from "axios";
import { JwtService } from "@nestjs/jwt";

import { ConfigService } from "@nestjs/config";
import { AppConfig } from "src/config/dto/config.dto";
import { AuthRequest } from "src/types/express";
import { UserService } from "src/users/user.service";

@Controller('api/v1/auth')
export class AuthenticationController {
    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly responseService: ResponseService
    ) { }

    @Get('@me')
    async me(@Req() req: AuthRequest) {
        if (!req.user) return this.responseService.UnauthorizedResponse("User not logged in")

        const me = await this.userService.findUserById({ id: req.user._id })
        if (!me) return this.responseService.UnauthorizedResponse("User not found")

        const user = {
            id: me.id,
            username: me.username,
            email: me.email,
            profile_created: me.profile_created,
            discord_id: me.discord_id
        }

        return this.responseService.OkResponse(user)
    }

    @Post('discord')
    async discord(@Body() authDiscordDto: AuthReqDiscordDto) {
        if (!authDiscordDto || !authDiscordDto.code || authDiscordDto.code === "") {
            const clientId = this.configService.get("discord")["clientId"]
            const redirectUri = encodeURIComponent(this.configService.get("discord")["redirectUri"]);
            const scope = (this.configService.get("discord")["scope"]?.split(",").join("+") || "identify+email").replace(/\s+/g, '');

            return this.responseService.OkResponse({
                url: `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
            });
        }

        const code = authDiscordDto.code

        try {
            const { data } = await axios.post(
                "https://discord.com/api/oauth2/token",
                new URLSearchParams({
                    client_id: this.configService.get("discord")["clientId"],
                    client_secret: this.configService.get("discord")["clientSecret"],
                    code,
                    redirect_uri: this.configService.get("discord")["redirectUri"],
                    grant_type: "authorization_code",
                }).toString(),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            const { data: profile } = await axios.get("https://discord.com/api/users/@me", {
                headers: { Authorization: `Bearer ${data.access_token}` },
            });

            const user = await this.authenticationService.discord({
                email: profile.email,
                name: profile.username,
                discord_id: profile.id
            })

            const access_token = await this.jwtService.signAsync(
                { _id: user.id, email: user.email },
                {
                    secret: this.configService.get("jwt")["accessTokenSecret"],
                    expiresIn: this.configService.get("jwt")["accessTokenExpiration"]
                }
            );

            const refresh_token = await this.jwtService.signAsync(
                { _id: user.id, email: user.email },
                {
                    secret: this.configService.get("jwt")["refreshTokenSecret"],
                    expiresIn: this.configService.get("jwt")["refreshTokenExpiration"]
                }
            );

            this.authenticationService.storeRefreshToken({ userid: user.id, refresh_token });

            const dataResponse = {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                access_token,
                refresh_token
            }

            return this.responseService.OkResponse(dataResponse)

        } catch (err) {
            if (isAxiosError(err)) {
                return this.responseService.ServerErrorResponse(err.response?.data?.error || "Something went wrong");
            }
            return this.responseService.ServerErrorResponse("Something went wrong");
        }
    }

    @Post('refresh_token')
    async refreshToken(@Req() req: AuthRequest, @Body() authReqRefreshTokenDto: AuthReqRefreshTokenDto) {
        if (!req.user) return this.responseService.UnauthorizedResponse("User not logged in")

        if (!authReqRefreshTokenDto || !authReqRefreshTokenDto.refresh_token || authReqRefreshTokenDto.refresh_token == "") {
            return this.responseService.BadRequestResponse("Refresh token is required")
        }

        try {
            const { _id } = this.jwtService.verify(authReqRefreshTokenDto.refresh_token, { secret: this.configService.get("jwt")["refreshTokenSecret"] }) as { _id: number };
            const user = await this.userService.findUserById({ id: _id });
            if (!user || user.id !== req.user._id) {
                return this.responseService.BadRequestResponse("Something went wrong")
            }

            if (user.refresh_token !== authReqRefreshTokenDto.refresh_token) {
                return this.responseService.BadRequestResponse("Invalid refresh token")
            }

            const new_access_token = await this.jwtService.signAsync(
                { _id: user.id, email: user.email },
                {
                    secret: this.configService.get("jwt")["accessTokenSecret"],
                    expiresIn: this.configService.get("jwt")["accessTokenExpiration"]
                }
            );

            const new_refresh_token = await this.jwtService.signAsync(
                { _id: user.id, email: user.email },
                {
                    secret: this.configService.get("jwt")["refreshTokenSecret"],
                    expiresIn: this.configService.get("jwt")["refreshTokenExpiration"]
                }
            );

            await this.authenticationService.storeRefreshToken({ userid: user.id, refresh_token: new_refresh_token });

            return this.responseService.OkResponse({ access_token: new_access_token, refresh_token: new_refresh_token });

        } catch (err) {
            return this.responseService.ServerErrorResponse("Something went wrong")
        }
    }
}
