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

    return response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
