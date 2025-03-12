import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {
    OkResponse(data?: any) {
        return {
            success: true,
            message: 'success',
            ...(data && { data }),
        };
    }

    BadRequestResponse(msg: string = 'Bad Request') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.BAD_REQUEST,
        );
    }

    UnauthorizedResponse(msg: string = 'Unauthorized') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.UNAUTHORIZED,
        );
    }

    PaymentRequiredResponse(msg: string = 'Payment Required') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.PAYMENT_REQUIRED,
        );
    }

    ForbiddenResponse(msg: string = 'Forbidden') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.FORBIDDEN,
        );
    }

    NotFoundResponse(msg: string = 'Not Found') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.NOT_FOUND,
        );
    }

    ConflictResponse(msg: string = 'Conflict') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.CONFLICT,
        );
    }

    ServerErrorResponse(msg: string = 'Internal Server Error') {
        throw new HttpException(
            { success: false, message: msg },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
