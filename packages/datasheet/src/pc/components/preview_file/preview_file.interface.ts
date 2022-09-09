import { IAttachmentValue } from '@vikadata/core';

export type ITranslatePosition = { x: number; y: number };

export interface IExpandPreviewModalFuncProps {
  datasheetId?: string; // 3 个 id 同时存在时，会从 redux 中读取附件列表，实现协同读取
  recordId?: string;
  fieldId?: string;
  activeIndex: number;
  cellValue: IAttachmentValue[];
  editable: boolean;
  onChange: (cellValue: IAttachmentValue[]) => void;
  disabledDownload: boolean;
}

export interface ITransFormInfo {
  rotate: number;
  scale: number;
  translatePosition: ITranslatePosition;
  initActualScale: number;
}
