/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// eslint-disable-next-line no-restricted-imports
import { ITheme, Select, useTheme } from '@apitable/components';
import { FieldType, IField } from '@apitable/core';
import {
  UserOutlined,
  AttachmentOutlined,
  AutonumberOutlined,
  CalendarOutlined,
  CheckboxOutlined,
  UserAddOutlined,
  TimeOutlined,
  CurrencyUsdOutlined,
  EmailOutlined,
  NumberOutlined,
  FormulaOutlined,
  UserEditOutlined,
  HistoryFilled,
  LinktableOutlined,
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
} from '@apitable/icons';

const FieldIconMap = {
  [FieldType.DeniedField]: LockFilled,
  [FieldType.Text]: LongtextOutlined,
  [FieldType.Number]: NumberOutlined,
  [FieldType.SingleSelect]: SelectSingleOutlined,
  [FieldType.MultiSelect]: SelectMultipleOutlined,
  [FieldType.DateTime]: CalendarOutlined,
  [FieldType.Attachment]: AttachmentOutlined,
  [FieldType.Link]: LinktableOutlined,
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
};

const transformOptions = (fields: IField[], theme: ITheme) => {
  return fields.map((field) => {
    const res = {
      label: field.name,
      value: field.id,
    };
    const FieldIcon = FieldIconMap[field.type];
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
  disabled?: boolean;
  onChange?: (value: any) => void;
}
export const FieldSelect = ({ disabled, fields, value, onChange }: IFieldSelectProps) => {
  const theme = useTheme();
  const options = transformOptions(fields, theme);
  return (
    <>
      <Select
        disabled={disabled}
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
    </>
  );
};
