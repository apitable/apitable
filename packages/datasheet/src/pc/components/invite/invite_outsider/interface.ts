// The result of the response after uploading the file
export interface IUploadFileResponse {
  errorCount: number;
  errorList: IErrorInfo[];
  rowCount: number;
  successCount: number;
}

export interface IErrorInfo {
  rowNumber: number;
  name: string;
  email: string;
  team: string;
  message: string;
}

export type IKidType = 'beforeUpload' | 'processing' | 'fileSelected' | 'fail' | 'success';

export enum KidType {
  BeforeUpload = 'beforeUpload',
  Processing = 'processing',
  FileSelected = 'fileSelected',
  Fail = 'fail',
  Success = 'success',
}