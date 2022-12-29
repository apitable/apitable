import { ITheme, Select, useTheme } from '@apitable/components';
import { FieldType, IField } from '@apitable/core';
import {
  AccountFilled, ColumnAttachmentFilled,
  ColumnAutonumberFilled,
  ColumnCalendarFilled, ColumnCheckboxFilled,
  ColumnCreatedbyFilled,
  ColumnCreatedtimeFilled,
  ColumnCurrencyFilled,
  ColumnEmailFilled,
  ColumnFigureFilled, ColumnFormulaFilled,
  ColumnLastmodifiedbyFilled, ColumnLastmodifiedtimeFilled,
  ColumnLinktableFilled,
  ColumnLongtextFilled,
  ColumnLookupFilled, ColumnMultipleFilled, ColumnPercentFilled,
  ColumnPhoneFilled,
  ColumnRatingFilled, ColumnSingleFilled, ColumnTextFilled,
  ColumnUrlOutlined,
  LockFilled
} from '@apitable/icons';

const FieldIconMap = {
  [FieldType.DeniedField]: LockFilled,
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

const transformOptions = (fields: IField[], theme: ITheme) => {

  return fields.map(field => {
    const res = {
      label: field.name,
      value: field.id,
    };
    const FieldIcon = FieldIconMap[field.type];
    return {
      ...res,
      disabled: field.type === FieldType.DeniedField,
      prefixIcon: <FieldIcon color={theme.palette.text.third} />,
    };
  });
};

interface IFieldSelectProps {
  fields: IField[];
  value: string;
  onChange?: (value: any) => void;
}
export const FieldSelect = ({ fields, value, onChange }: IFieldSelectProps) => {
  const theme = useTheme();
  const options = transformOptions(fields, theme);
  return <>
    <Select
      options={options}
      value={value}
      onSelected={(option) => {
        onChange && onChange(option.value);
      }}
      // FIXME：Adjusting maxHeight inside the dropdown list and limiting it outside will result in double scrollbars
      // listStyle={{
      //   maxHeight: 320,
      //   overflow: 'scroll',
      // }}
      hideSelectedOption={!value}
      dropdownMatchSelectWidth
      openSearch={options.length > 7}
    />
  </>;
};
