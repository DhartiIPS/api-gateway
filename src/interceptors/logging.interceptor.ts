import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(
        (response) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} - ${ip} - ${duration}ms`,
          );
        },
        (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} - ${ip} - ${duration}ms - Error: ${error.message}`,
          );
        },
      ),
    );
  }
}
