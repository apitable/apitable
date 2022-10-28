export enum ApiExceptionEnum {
  /**
   * unauthorized, httpStatus code is 401
   */
  UNAUTHORIZED_ERROR,
  /**
   * parameters exception, httpStatus is 200, code is 400
   */
  VALIDATION,
  /**
   * datasheet not exist, httpStatus is 200, code is 301
   */
  DST_NOT_EXISTS,
  /**
   * exceed API request limit, httpStatus is 403, code is 403
   */
  API_LIMIT_EXCEEDED,
  /**
   * Failed to connect backend server, httpStatus is 500, code is 500
   */
  CONNECT_BACKEND_SERVER_ERROR,
  /**
   * server error, http status is 200, code is 500
   */
  SERVER_ERROR,
  /**
   * insert data error
   */
  INSERT_ERROR,
  /**
   * edit data error
   */
  EDIT_ERROR,
  /**
   * delete data error
   */
  DELETE_ERROR,
  /**
   * no permission of the node
   */
  NODE_OPERATION_DENIED,
}
