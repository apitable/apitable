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

import { ITheme, DropdownSelect as Select, useTheme } from '@apitable/components';
import { FieldType, IField } from '@apitable/core';
import { FieldIconMapFieldType as FieldIconMap } from '@apitable/widget-sdk';

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
  );
};
