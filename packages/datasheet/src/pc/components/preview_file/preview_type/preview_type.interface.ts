import { IAttachmentValue, IUserInfo } from '@apitable/core';
import { ITransFormInfo } from '../preview_file.interface';

export interface IPreviewTypeBase {
  file: IAttachmentValue;
  transformInfo: ITransFormInfo;
  userInfo: IUserInfo | null;
  spaceId?: string;
  onClose: () => void;
  officePreviewEnable: boolean;
  previewUrl: string | null;
  setTransformInfo: (transformInfo: ITransFormInfo, immediately?: boolean) => void;
  disabledDownload: boolean;
}
