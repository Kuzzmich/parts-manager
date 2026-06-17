import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const exceptionResponse = exception.getResponse();

    const raw = (exceptionResponse as any).message;
    const message = Array.isArray(raw) ? raw.join(', ') : raw;

    return response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
