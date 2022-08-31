import { AxiosRequestConfig } from 'axios';

export enum UploadType {
  // 用户头像，会硬删除
  UserAvatar,
  // 空间 logo，会硬删除
  SpaceLogo,
  // 数表附件
  // 表格内使用这个
  DstAttachment,
  // 封面图
  // fold showcase 用这个
  CoverImage,
  // 节点描述
  NodeDesc
}

export interface IUploadCertificate {
  count: number,
  data: string,
  nodeId?: string,
  type: UploadType
}

export interface IUploadFileForSaaS {
  file: File;
  fileType: UploadType;
  nodeId?: string;
  axiosConfig?: AxiosRequestConfig | undefined;
  data?: string | undefined;
}
