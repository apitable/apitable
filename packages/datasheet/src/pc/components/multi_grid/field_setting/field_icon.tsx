import { FieldType } from '@vikadata/core';
import { colorVars } from '@vikadata/components';
import {
  ColumnAttachmentFilled,
  ColumnAutonumberFilled,
  AccountFilled,
  ColumnCheckboxFilled,
  ColumnLastmodifiedtimeFilled,
  ColumnTextFilled,
  ColumnCreatedbyFilled,
  ColumnCreatedtimeFilled,
  ColumnSingleFilled,
  ColumnCurrencyFilled,
  ColumnEmailFilled,
  ColumnFormulaFilled,
  ColumnPercentFilled,
  ColumnFigureFilled,
  ColumnMultipleFilled,
  ColumnCalendarFilled,
  ColumnLinktableFilled,
  ColumnUrlOutlined,
  ColumnLastmodifiedbyFilled,
  ColumnLongtextFilled,
  ColumnPhoneFilled,
  ColumnLookupFilled,
  ColumnRatingFilled,
} from '@vikadata/icons';

const FieldIconMap = {
  [FieldType.Text]: ColumnLongtextFilled,
  [FieldType.Number]: ColumnFigureFilled,
  [FieldType.SingleSelect]: ColumnSingleFilled,
  [FieldType.MultiSelect]: ColumnMultipleFilled,
  [FieldType.DateTime]: ColumnCalendarFilled,
  [FieldType.Attachment]: ColumnAttachmentFilled,
  [FieldType.Link]: ColumnLinktableFilled,
  [FieldType.URL]: ColumnUrlOutlined,
  [FieldType.Email]: ColumnEmailFilled,
  [FieldType.Phone]: ColumnPhoneFilled,
  [FieldType.Checkbox]: ColumnCheckboxFilled,
  [FieldType.Rating]: ColumnRatingFilled,
  [FieldType.Member]: AccountFilled,
  [FieldType.LookUp]: ColumnLookupFilled,
  [FieldType.Formula]: ColumnFormulaFilled,
  [FieldType.Currency]: ColumnCurrencyFilled,
  [FieldType.Percent]: ColumnPercentFilled,
  [FieldType.SingleText]: ColumnTextFilled,
  [FieldType.AutoNumber]: ColumnAutonumberFilled,
  [FieldType.CreatedTime]: ColumnCreatedtimeFilled,
  [FieldType.LastModifiedTime]: ColumnLastmodifiedtimeFilled,
  [FieldType.CreatedBy]: ColumnCreatedbyFilled,
  [FieldType.LastModifiedBy]: ColumnLastmodifiedbyFilled,
};

export const getFieldTypeIcon = (type: FieldType, fillColor: string = colorVars.thirdLevelText, width = 16, height = 16) => {
  const FieldIcon = FieldIconMap[type];
  if (!FieldIcon) {
    return <div />;
  }
  const size = width || height;
  return <FieldIcon size={size} color={fillColor} />;
};
