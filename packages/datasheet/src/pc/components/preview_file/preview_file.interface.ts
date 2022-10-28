import { IAttachmentValue } from '@apitable/core';

export type ITranslatePosition = { x: number; y: number };

export interface IExpandPreviewModalFuncProps {
  // When all three ids exist at the same time, the attachment list will be read from redux, enabling collaborative reading
  datasheetId?: string;
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
