import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findUserById({ id }: { id: number }) {
        return await this.prisma.users.findUnique({
            where: { id }
        });
    }

    async findUserByUsername({ username }: { username: string }) {
        return await this.prisma.users.findFirst({
            where: { username }
        });
    }
}
