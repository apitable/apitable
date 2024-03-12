import { DropdownSelect as Select, ITheme, useTheme } from '@apitable/components';
import { Field, FieldType, IField, Strings, t } from '@apitable/core';
import {
  AttachmentOutlined,
  AutonumberOutlined,
  CalendarOutlined,
  CheckboxOutlined,
  CurrencyUsdOutlined,
  EmailOutlined,
  TimeOutlined,
  UserAddOutlined,
  UserOutlined,
  NumberOutlined,
  FormulaOutlined,
  HistoryFilled,
  TwoWayLinkOutlined,
  OneWayLinkOutlined,
  LongtextOutlined,
  LookupOutlined,
  SelectMultipleOutlined,
  PercentOutlined,
  TelephoneOutlined,
  StarOutlined,
  SelectSingleOutlined,
  TextOutlined,
  LinkOutlined,
  LockFilled,
  CascadeOutlined,
  FileOutlined,
  IIconProps,
  UserEditOutlined,
  CursorButtonOutlined,
} from '@apitable/icons';

import React, { FC } from 'react';

import { FieldType as WidgetFieldType } from '../../interface/field_types';

const FieldIconMap: { [key in WidgetFieldType]: FC<IIconProps> } = {
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
  [WidgetFieldType.Percent]: PercentOutlined,
  [WidgetFieldType.SingleText]: TextOutlined,
  [WidgetFieldType.AutoNumber]: AutonumberOutlined,
  [WidgetFieldType.CreatedTime]: TimeOutlined,
  [WidgetFieldType.LastModifiedTime]: HistoryFilled,
  [WidgetFieldType.CreatedBy]: UserAddOutlined,
  [WidgetFieldType.LastModifiedBy]: UserEditOutlined,
  [WidgetFieldType.Cascader]: CascadeOutlined,
  [WidgetFieldType.Button]: CursorButtonOutlined,
  [WidgetFieldType.WorkDoc]: FileOutlined,
};

const FieldIconMapFieldType: { [key in FieldType]: FC<IIconProps> } = {
  [FieldType.NotSupport]: LockFilled,
  [FieldType.DeniedField]: LockFilled,
  [FieldType.NotSupport]: LockFilled,
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
  [FieldType.Percent]: PercentOutlined,
  [FieldType.SingleText]: TextOutlined,
  [FieldType.AutoNumber]: AutonumberOutlined,
  [FieldType.CreatedTime]: TimeOutlined,
  [FieldType.LastModifiedTime]: HistoryFilled,
  [FieldType.CreatedBy]: UserAddOutlined,
  [FieldType.LastModifiedBy]: UserEditOutlined,
  [FieldType.Cascader]: CascadeOutlined,
  [FieldType.WorkDoc]: FileOutlined,
  [FieldType.Button]: CursorButtonOutlined,
};

const transformOptions = (fields: IField[], theme: ITheme) => {
  const notSupportField = [FieldType.CreatedBy, FieldType.LastModifiedBy, FieldType.Member];
  return fields
    .filter((field) => {
      if (field.type === FieldType.LookUp) {
        const entityField = Field.bindModel(field).getLookUpEntityField();
        return entityField ? !notSupportField.includes(entityField.type) : true;
      }
      return !notSupportField.includes(field.type);
    })
    .map((field) => {
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

  return (
    <>
      <Select
        dropDownOptions={{
          placement: 'bottom-start',
        }}
        panelOptions={{
          maxWidth: '300px',
        }}
        dropdownMatchSelectWidth={false}
        placeholder={t(Strings.pick_one_option)}
        searchPlaceholder={t(Strings.search)}
        options={options}
        value={value}
        onSelected={(option) => {
          onChange && onChange(option.value);
        }}
        hideSelectedOption={!value}
        openSearch={options.length > 7}
      />
    </>
  );
};

export { FieldIconMap, FieldIconMapFieldType };
