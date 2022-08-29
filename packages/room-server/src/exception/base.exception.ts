/**
 * 基础异常规范接口
 */
export interface IBaseException {

  /**
   * 返回异常状态码
   */
  getCode(): number;

  /**
   * 返回异常状态信息
   */
  getMessage(): string;
}
