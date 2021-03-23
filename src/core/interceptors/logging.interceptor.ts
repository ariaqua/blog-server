import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const ip = request.ip;
    const log = `-- log: ${method} - ${url} - ${ip} - ${Date.now() - now}ms`;
    return next
      .handle() // return an obserable
      .pipe(tap(() => console.log(log)));
  }
}
