import { ICell, ICellValue, IField, IRecordAlarmClient, WithOptional } from '@apitable/core';

export interface IEditor {
  focus(preventScroll?: boolean): void;
  blur?: () => void;

  onEndEdit(cancel: boolean): void;

  /**
   * keepValue 表示是否需要在编辑框中填充当前单元格的值
   * 在双击打开单元格的时候填充cellValue
   * 在使用键盘直接输入的时候只显示按下的字符
   */
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
