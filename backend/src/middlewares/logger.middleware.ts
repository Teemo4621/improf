import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, url, ip } = req;
        const userAgent = req.get('User-Agent') || 'Unknown';
        const timestamp = new Date().toISOString();

        console.log(
            `${chalk.gray(`[${timestamp}]`)} ` +
            `${this.getMethodColor(method)} ` +
            `${chalk.cyan(url)} ` +
            `- ${chalk.yellow(ip)} ` +
            `(${chalk.green(userAgent)})`
        );

        next();
    }

    private getMethodColor(method: string): string {
        switch (method) {
            case 'GET': return chalk.green(method);
            case 'POST': return chalk.blue(method);
            case 'PUT': return chalk.yellow(method);
            case 'DELETE': return chalk.red(method);
            default: return chalk.white(method);
        }
    }
}
