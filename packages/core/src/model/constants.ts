import { BasicValueType } from 'types';

// 相册视图无封面字段 ID
export const NO_COVER_FIELD_ID = 'NO_COVER_FIELD_ID';

export const DEFAULT_TIMEZONE = 'Asia/Shanghai';

export const ValueTypeMap = {
  [BasicValueType.Number]: 'number',
  [BasicValueType.String]: 'string',
  [BasicValueType.Boolean]: 'boolean',
  [BasicValueType.Array]: 'array',
  [BasicValueType.DateTime]: 'string',
};
