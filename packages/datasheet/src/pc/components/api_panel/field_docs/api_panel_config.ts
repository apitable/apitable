import { SystemConfig, FieldType } from '@apitable/core';

export const getFieldDocs = (fieldType: FieldType): {
  valueType?: string;
  defaultExampleId?: string;
  descriptionId?: string;
} => {
  const str = FieldType[fieldType];
  return SystemConfig.api_panel[str] || {};
};
