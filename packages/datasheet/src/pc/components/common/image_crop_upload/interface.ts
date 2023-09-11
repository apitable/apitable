export enum TabKeys {
  Default = '1',
  Custom = '2',
}

export enum ICropShape {
  AnyShape = 'AnyShape',
  Square = 'Square',
  Rectangle = 'Rectangle',
}

export enum IPreviewShape {
  Circle = 'Circle',
  Square = 'Square',
  Rectangle = 'Rectangle',
}

export enum IUploadType {
  Avatar = 'Avatar',
  Other = 'Other',
}

interface ISelectInfoBase {
  officialToken: string;
  officialUrl: string;
  customUrl: string;
  customFile: File | string;
  color: number | null;
}

export interface ICustomTip {
  previewTip?: string;
  previewDesc?: string;
  cropTip?: string;
  cropDesc?: string;
}

export type ISelectInfo = Partial<ISelectInfoBase>;

export interface IImageUploadProps {
  type?: IUploadType;
  avatarName?: string;
  visible: boolean;
  initPreview: React.ReactNode; // Image Preview Component
  title?: string;
  fileLimit?: number; // Upload the image size limit in MB, e.g. to limit the image size limit to 2MB after cropping, pass 2 for fileLimit
  officialImgs?: string[]; // Official avatar list, pass id
  customTips?: ICustomTip; // Customise the preview area and crop area Tip text
  previewShape?: IPreviewShape; // The shape of the preview image
  cropShape?: ICropShape;
  cancel: () => void;
  confirm: (data: ISelectInfo) => void;
  avatarColor?: number | null;
}

export interface IImageCropUploadRef {
  clearState: () => void;
}
