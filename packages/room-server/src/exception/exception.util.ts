/**
 * 自定义服务异常工具类
 */
import { IBaseException } from 'exception/base.exception';
import { ServerException } from 'exception/server.exception';

export class ExceptionUtil {
  static isTrue(expression: boolean, e: IBaseException) {
    if (expression) {
      throw new ServerException(e);
    }
  }
}
