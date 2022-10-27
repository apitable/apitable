import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * <p>
 * rpc exception filter
 * </p>
 */
@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    return throwError(exception.getError());
  }
}
