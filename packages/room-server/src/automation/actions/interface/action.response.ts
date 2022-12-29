import {ResponseStatusCodeEnums} from "../enum/response.status.code.enums";

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