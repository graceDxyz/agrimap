import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private logger = morgan('combined'); // Use the desired logging format

  use(req: Request, res: Response, next: NextFunction) {
    this.logger(req, res, next);
  }
}
