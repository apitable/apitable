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
