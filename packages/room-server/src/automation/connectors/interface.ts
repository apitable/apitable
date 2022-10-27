export enum ResponseStatusCodeEnums {
  Success = 200, 
  ClientError = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
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