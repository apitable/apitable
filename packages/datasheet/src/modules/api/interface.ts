export interface IResponseStruct<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}
