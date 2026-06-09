import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => {
      const end = Date.now();
      console.log(
        `${req.method} ${req.url} ${res.statusCode} - ${end - start}ms`,
      );
    });
    next();
  }
}
