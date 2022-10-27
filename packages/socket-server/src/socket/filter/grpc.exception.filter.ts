import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * <p>
 * rpc exception filter
 * </p>
 * @author Zoe zheng
 * @date 2021/3/31 4:10 下午
 */
@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    return throwError(exception.getError());
  }
}
