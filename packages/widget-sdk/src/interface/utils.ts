export interface IUploadProgress {
  /** 已经传输多少字节 */
  loaded: number;
  /** 文件大小，总共多少字节 */
  total: number;
}