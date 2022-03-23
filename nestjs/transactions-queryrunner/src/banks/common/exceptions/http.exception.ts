import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception['name'];
    const data =
      exception['message'] !== undefined
        ? exception['message']
        : exception['error'];

    response.status(status).json({
      isError: true,
      message: message,
      statusCode: status,
      data: data,
    });
  }
}
