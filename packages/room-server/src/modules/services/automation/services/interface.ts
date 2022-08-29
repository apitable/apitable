export enum ResponseStatusCodeEnums {
  Success = 200, // 成功正常返回
  ClientError = 400, // 客户端输入的 input 有错误
  Unauthorized = 401, // 未登录:header 里面要有 token
  Forbidden = 403, // 没有权限
  NotFound = 404, // 没有找到对于的 endpoint
  ServerError = 500, // 服务端出错误了
}

export interface ISuccessResponse<T> {
  data: T;
}

export interface IErrorResponse {
  errors: {
    message: string;
  }[]
}

export type IActionResponse<T> = {
  success: boolean;
  data: ISuccessResponse<T> | IErrorResponse;
  code: ResponseStatusCodeEnums
};