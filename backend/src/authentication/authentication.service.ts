import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthenticationService {
    constructor(private prisma: PrismaService) { }

    async discord({ email, name, discord_id }: { email: string, name: string, discord_id: string }) {
        let user = await this.prisma.users.findFirst({
            where: { email }
        });

        if (user) {
            user = await this.prisma.users.update({
                where: { email },
                data: {
                    username: name
                }
            });
        } else {
            user = await this.prisma.users.create({
                data: {
                    username: name,
                    email,
                    discord_id
                }
            });
        }

        return user;
    }

    async storeRefreshToken({ userid, refresh_token }: { userid: number, refresh_token: string }) {
        await this.prisma.users.update({
            where: { id: Number(userid) },
            data: {
                refresh_token
            }
        });
    }
}