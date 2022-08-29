export enum ApiExceptionEnum {
  /**
   * 未登录, httpStatus 401 code 401 不收费
   */
  UNAUTHORIZED_ERROR,
  /**
   * 各种验证异常 param, field 返回httpStatus 200 code 400
   */
  VALIDATION,
  /**
   * 数表异常(数表被删除，或者数表对应的spaceId不是当前token的spaceID) 返回httpStatus 200 code 301
   */
  DST_NOT_EXISTS,
  /**
   * 超出pai限制 httpStatus 403 code 403
   */
  API_LIMIT_EXCEEDED,
  /**
   * 调用java服务失败 httpStatus 500 code 500
   */
  CONNECT_BACKEND_SERVER_ERROR,
  /**
   * 服务异常 httpStatus 200 code 500
   */
  SERVER_ERROR,
  /**
   * 写入数据失败
   */
  INSERT_ERROR,
  /**
   * 修改数据失败
   */
  EDIT_ERROR,
  /**
   * 删除数据失败
   */
  DELETE_ERROR,
  /**
   * 无节点权限操作
   */
  NODE_OPERATION_DENIED,
}
