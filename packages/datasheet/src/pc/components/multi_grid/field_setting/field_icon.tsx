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

import { colorVars } from '@apitable/components';
import { FieldType } from '@apitable/core';
import {
  AttachmentOutlined,
  AutonumberOutlined,
  UserOutlined,
  CheckboxOutlined,
  HistoryFilled,
  TextOutlined,
  UserAddOutlined,
  TimeOutlined,
  SelectSingleOutlined,
  CurrencyUsdOutlined,
  EmailOutlined,
  FormulaOutlined,
  PercentOutlined,
  NumberOutlined,
  SelectMultipleOutlined,
  CalendarOutlined,
  LinktableOutlined,
  LinkOutlined,
  UserEditOutlined,
  LongtextOutlined,
  TelephoneOutlined,
  LookupOutlined,
  StarOutlined,
  CascadeOutlined,
} from '@apitable/icons';

const FieldIconMap = {
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

export const getFieldTypeIcon = (type: FieldType, fillColor: string = colorVars.thirdLevelText, width = 16, height = 16) => {
  const FieldIcon = FieldIconMap[type];
  if (!FieldIcon) {
    return <div />;
  }
  const size = width || height;
  return <FieldIcon size={size} color={fillColor} />;
};
