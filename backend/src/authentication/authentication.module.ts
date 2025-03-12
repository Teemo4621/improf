import { UserModule } from './../users/user.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [AuthenticationController],
    providers: [PrismaService, JwtService, AuthenticationService],
})
export class AuthenticationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            { path: "api/v1/auth/refresh_token", method: RequestMethod.POST },
            { path: "api/v1/auth/@me", method: RequestMethod.GET },
        );
    }
}
