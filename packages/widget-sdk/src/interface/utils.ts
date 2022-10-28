export interface IUploadProgress {
  /** How many bytes have been transferred */
  loaded: number;
  /** File size, how many bytes in total */
  total: number;
}