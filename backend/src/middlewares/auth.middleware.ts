import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthRequest } from 'src/types/express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private config: ConfigService,
        private jwtService: JwtService
    ) { };;

    use(req: AuthRequest, res: Response, next: NextFunction) {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = this.jwtService.verify(token, { secret: this.config.get("jwt")["accessTokenSecret"] });
            req.user = decoded as { _id: number, email: string };
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
    }
}
