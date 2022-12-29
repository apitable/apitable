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

// LookUp value is another entity field cell value flat array
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