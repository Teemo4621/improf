import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { CommonModule } from './common/common.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserModule } from './users/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true
        }),
        CommonModule,
        AuthenticationModule,
        ProfilesModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}