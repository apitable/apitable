/**
 * 自定义服务异常工具类
 */
import { IBaseException } from './base.exception';
import { ServerException } from 'shared/exception/server.exception';

export class ExceptionUtil {
  static isTrue(expression: boolean, e: IBaseException) {
    if (expression) {
      throw new ServerException(e);
    }
  }
}
