import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [ProfilesController],
    providers: [PrismaService, JwtService, ProfilesService],
})
export class ProfilesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'api/v1/profiles', method: RequestMethod.POST },
                { path: 'api/v1/profiles/update', method: RequestMethod.POST },
            );
    }
}