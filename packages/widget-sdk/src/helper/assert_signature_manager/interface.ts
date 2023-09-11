export interface IBatchSignatureResponse {
  success: boolean;
  code: number;
  message: string;
  data: Array<{ resourceKey: string; url: string }>
}
