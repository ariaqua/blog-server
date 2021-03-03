import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP_SUCCESS_MSG } from 'src/constants/http.constant';

export interface ResponseData<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const statusCode = res.statusCode;
    const message =
      this.reflector.get<string>('message', context.getHandler()) ||
      HTTP_SUCCESS_MSG;
    const timestamp = new Date().toLocaleString();
    const path = req.path;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message,
        timestamp,
        path,
        data,
      })),
    );
  }
}
