import { ICell, ICellValue, IField, IRecordAlarmClient, WithOptional } from '@apitable/core';

export interface IEditor {
  focus(preventScroll?: boolean): void;
  blur?: () => void;

  onEndEdit(cancel: boolean): void;
 
  onStartEdit(cellValue?: ICellValue): void;

  setValue(cellValue?: ICellValue): void;

  saveValue(): void;
}

export interface IBaseEditorProps {
  datasheetId: string;
  width: number;
  height: number;
  field: IField;
  disabled?: boolean;
  onSave?: (val: any, alarm?: WithOptional<IRecordAlarmClient, 'id'>) => void;
  onChange?: (val: any) => void;
}

export interface IContainerEdit {
  onViewMouseDown(activeCell?: ICell): void;
  focus(): void;
}
