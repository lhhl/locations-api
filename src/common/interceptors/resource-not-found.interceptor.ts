import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'constants/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResourceNotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data !== null) return data;
        throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      }),
    );
  }
}
