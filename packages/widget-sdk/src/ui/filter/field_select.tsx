import { ITheme, DropdownSelect as Select, useTheme } from '@apitable/components';
import { Field, FieldType, IField, Strings, t } from '@apitable/core';
import {
  UserOutlined, AttachmentOutlined,
  AutonumberOutlined,
  CalendarOutlined, CheckboxOutlined,
  UserAddOutlined,
  TimeFilled,
  CurrencyUsdOutlined,
  CurrencyCnyOutlined,
  EmailOutlined,
  NumberOutlined, FormulaOutlined,
  UserEditOutlined, HistoryFilled,
  TwoWayLinkOutlined,
  OneWayLinkOutlined,
  LongtextOutlined,
  LookupOutlined, SelectMultipleOutlined, PercentOutlined,
  TelephoneOutlined,
  StarOutlined, SelectSingleOutlined, TextOutlined,
  LinkOutlined,
  LockFilled, CascadeOutlined, FileOutlined, IIconProps,
} from '@apitable/icons';

import { FieldType as WidgetFieldType } from '../../interface/field_types';

import React, { FC } from 'react';

const FieldIconMap : {[key in WidgetFieldType]: FC<IIconProps> }= {
  [WidgetFieldType.Text]: LongtextOutlined,
  [WidgetFieldType.Number]: NumberOutlined,
  [WidgetFieldType.SingleSelect]: SelectSingleOutlined,
  [WidgetFieldType.MultiSelect]: SelectMultipleOutlined,
  [WidgetFieldType.DateTime]: CalendarOutlined,
  [WidgetFieldType.Attachment]: AttachmentOutlined,
  [WidgetFieldType.TwoWayLink]: TwoWayLinkOutlined,
  [WidgetFieldType.OneWayLink]: OneWayLinkOutlined,
  [WidgetFieldType.URL]: LinkOutlined,
  [WidgetFieldType.Email]: EmailOutlined,
  [WidgetFieldType.Phone]: TelephoneOutlined,
  [WidgetFieldType.Checkbox]: CheckboxOutlined,
  [WidgetFieldType.Rating]: StarOutlined,
  [WidgetFieldType.Member]: UserOutlined,
  [WidgetFieldType.MagicLookUp]: LookupOutlined,
  [WidgetFieldType.Formula]: FormulaOutlined,
  [WidgetFieldType.Currency]: CurrencyUsdOutlined,
  [WidgetFieldType.Currency]: CurrencyCnyOutlined,
  [WidgetFieldType.Percent]: PercentOutlined,
  [WidgetFieldType.SingleText]: TextOutlined,
  [WidgetFieldType.AutoNumber]: AutonumberOutlined,
  [WidgetFieldType.CreatedTime]: TimeFilled,
  [WidgetFieldType.LastModifiedTime]: HistoryFilled,
  [WidgetFieldType.CreatedBy]: UserAddOutlined,
  [WidgetFieldType.LastModifiedBy]: UserEditOutlined,
  [WidgetFieldType.Cascader]: CascadeOutlined,
  [WidgetFieldType.WorkDoc]: FileOutlined,
};

export { FieldIconMap };

const FieldIconMapFieldType: {[key in FieldType]: FC<IIconProps> }= {
  [FieldType.NotSupport]: LockFilled,
  [FieldType.DeniedField]: LockFilled,
  [FieldType.Text]: LongtextOutlined,
  [FieldType.Number]: NumberOutlined,
  [FieldType.SingleSelect]: SelectSingleOutlined,
  [FieldType.MultiSelect]: SelectMultipleOutlined,
  [FieldType.DateTime]: CalendarOutlined,
  [FieldType.Attachment]: AttachmentOutlined,
  [FieldType.Link]: TwoWayLinkOutlined,
  [FieldType.OneWayLink]: OneWayLinkOutlined,
  [FieldType.URL]: LinkOutlined,
  [FieldType.Email]: EmailOutlined,
  [FieldType.Phone]: TelephoneOutlined,
  [FieldType.Checkbox]: CheckboxOutlined,
  [FieldType.Rating]: StarOutlined,
  [FieldType.Member]: UserOutlined,
  [FieldType.LookUp]: LookupOutlined,
  [FieldType.Formula]: FormulaOutlined,
  [FieldType.Currency]: CurrencyUsdOutlined,
  [FieldType.Currency]: CurrencyCnyOutlined,
  [FieldType.Percent]: PercentOutlined,
  [FieldType.SingleText]: TextOutlined,
  [FieldType.AutoNumber]: AutonumberOutlined,
  [FieldType.CreatedTime]: TimeFilled,
  [FieldType.LastModifiedTime]: HistoryFilled,
  [FieldType.CreatedBy]: UserAddOutlined,
  [FieldType.LastModifiedBy]: UserEditOutlined,
  [FieldType.Cascader]: CascadeOutlined,
  [FieldType.WorkDoc]: FileOutlined,
};

const transformOptions = (fields: IField[], theme: ITheme) => {
  const notSupportField = [FieldType.CreatedBy, FieldType.LastModifiedBy, FieldType.Member];
  return fields.filter(field => {
    if (field.type === FieldType.LookUp) {
      const entityField = Field.bindModel(field).getLookUpEntityField();
      return entityField ? !notSupportField.includes(entityField.type) : true;
    }
    return !notSupportField.includes(field.type);
  }).map(field => {
    const res = {
      label: field.name,
      value: field.id,
    };
    const FieldIcon = FieldIconMapFieldType[field.type];
    return {
      ...res,
      disabled: field.type === FieldType.DeniedField,
      prefixIcon: <FieldIcon color={theme.color.fc3} />,
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
      placeholder={t(Strings.pick_one_option)}
      searchPlaceholder={t(Strings.search)}
      options={options}
      value={value}
      onSelected={(option) => {
        onChange && onChange(option.value);
      }}
      hideSelectedOption={!value}
      dropdownMatchSelectWidth
      openSearch={options.length > 7}
    />
  </>;
};
