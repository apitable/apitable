import { AxiosRequestConfig } from 'axios';

export enum UploadType {
  // user avatar(that will be physically removed)
  UserAvatar,
  // space logo(that will be physically removed)
  SpaceLogo,
  // datasheet attachment
  DstAttachment,
  // fold showcase with this
  CoverImage,
  // node description
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
