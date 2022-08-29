import { IAttachmentValue, ILinkIds, IMultiSelectedIds, ISegment, ITimestamp, IUnitIds } from 'types/field_types';

export type ICellValueBase = null |
  number |
  string |
  boolean |
  ISegment[] |
  IMultiSelectedIds |
  ITimestamp |
  IAttachmentValue[] |
  ILinkIds |
  IUnitIds;

// LookUp 单元格的值是其它实体字段单元格值组成的扁平数组
export type ILookUpValue = ICellValueBase[];
export type ICellValue = ICellValueBase | ILookUpValue;

export type ICellToStringOption = {
  datasheetId?: string;
  hideUnit?: boolean;
  orderInCellValueSensitive?: boolean;
};

export enum CellFormatEnum {
  STRING = 'string',
  JSON = 'json',
}

export enum FieldKeyEnum {
  NAME = 'name',
  ID = 'id',
}