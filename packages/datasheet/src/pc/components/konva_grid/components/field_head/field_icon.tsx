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

import { FC, memo } from 'react';
import { FieldType } from '@apitable/core';
import {
  AttachmentOutlined,
  AutonumberOutlined,
  CheckboxOutlined,
  UserAddOutlined,
  TimeOutlined,
  CurrencyUsdOutlined,
  FormulaOutlined,
  UserEditOutlined,
  HistoryFilled,
  LongtextOutlined,
  LookupOutlined,
  UserOutlined,
  PercentOutlined,
  TelephoneOutlined,
  StarOutlined,
  SelectMultipleOutlined,
  SelectSingleOutlined,
  LinkOutlined,
  NumberOutlined,
  EmailOutlined,
  CalendarOutlined,
  TextOutlined,
  CascadeOutlined,
  FileOutlined,
  OneWayLinkOutlined,
  TwoWayLinkOutlined,
  CursorButtonOutlined,
} from '@apitable/icons';
import { Icon } from 'pc/components/konva_components';

const ColumnLongtextFilledPath = LongtextOutlined.toString();
const ColumnTextFilledPath = TextOutlined.toString();
const ColumnSingleFilledPath = SelectSingleOutlined.toString();
const ColumnMultipleFilledPath = SelectMultipleOutlined.toString();
const ColumnCalendarFilledPath = CalendarOutlined.toString();
const ColumnAttachmentFilledPath = AttachmentOutlined.toString();
const ColumnFigureFilledPath = NumberOutlined.toString();
const ColumnTwoWayLinkOutlinedPath = TwoWayLinkOutlined.toString();
const ColumnOneWayLinkOutlinedPath = OneWayLinkOutlined.toString();
const ColumnUrlOutlinedPath = LinkOutlined.toString();
const ColumnEmailFilledPath = EmailOutlined.toString();
const ColumnPhoneFilledPath = TelephoneOutlined.toString();
const ColumnAutonumberFilledPath = AutonumberOutlined.toString();
const ColumnCheckboxFilledPath = CheckboxOutlined.toString();
const ColumnCreatedbyFilledPath = UserAddOutlined.toString();
const ColumnCreatedtimeFilledPath = TimeOutlined.toString();
const ColumnCurrencyFilledPath = CurrencyUsdOutlined.toString();
const ColumnFormulaFilledPath = FormulaOutlined.toString();
const ColumnLastmodifiedbyFilledPath = UserEditOutlined.toString();
const ColumnLastmodifiedtimeFilledPath = HistoryFilled.toString();
const ColumnLookupFilledPath = LookupOutlined.toString();
const ColumnMemberFilledPath = UserOutlined.toString();
const ColumnPercentFilledPath = PercentOutlined.toString();
const ColumnRatingFilledPath = StarOutlined.toString();
const ColumnCascadeOutlinedPath = CascadeOutlined.toString();
const ColumnWorkdocPath = FileOutlined.toString();
const CursorButtonOutlinedPath = CursorButtonOutlined.toString();

interface IFieldIconProps {
  fieldType: FieldType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

export const FieldIcon: FC<React.PropsWithChildren<IFieldIconProps>> = memo((props) => {
  const { fieldType, x, y, width, height, fill } = props;

  switch (fieldType) {
    case FieldType.Text:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnLongtextFilledPath} fill={fill} />;
    case FieldType.SingleText:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnTextFilledPath} fill={fill} />;
    case FieldType.SingleSelect:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnSingleFilledPath} fill={fill} />;
    case FieldType.MultiSelect:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnMultipleFilledPath} fill={fill} />;
    case FieldType.DateTime:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCalendarFilledPath} fill={fill} />;
    case FieldType.Attachment:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnAttachmentFilledPath} fill={fill} />;
    case FieldType.Number:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnFigureFilledPath} fill={fill} />;
    case FieldType.Link:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnTwoWayLinkOutlinedPath} fill={fill} />;
    case FieldType.OneWayLink:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnOneWayLinkOutlinedPath} fill={fill} />;
    case FieldType.URL:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnUrlOutlinedPath} fill={fill} />;
    case FieldType.Email:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnEmailFilledPath} fill={fill} />;
    case FieldType.Phone:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnPhoneFilledPath} fill={fill} />;
    case FieldType.Checkbox:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCheckboxFilledPath} fill={fill} />;
    case FieldType.Rating:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnRatingFilledPath} fill={fill} />;
    case FieldType.LookUp:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnLookupFilledPath} fill={fill} />;
    case FieldType.Formula:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnFormulaFilledPath} fill={fill} />;
    case FieldType.Member:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnMemberFilledPath} fill={fill} />;
    case FieldType.Currency:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCurrencyFilledPath} fill={fill} />;
    case FieldType.Percent:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnPercentFilledPath} fill={fill} />;
    case FieldType.AutoNumber:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnAutonumberFilledPath} fill={fill} />;
    case FieldType.CreatedTime:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCreatedtimeFilledPath} fill={fill} />;
    case FieldType.LastModifiedTime:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnLastmodifiedtimeFilledPath} fill={fill} />;
    case FieldType.CreatedBy:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCreatedbyFilledPath} fill={fill} />;
    case FieldType.LastModifiedBy:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnLastmodifiedbyFilledPath} fill={fill} />;
    case FieldType.Cascader:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnCascadeOutlinedPath} fill={fill} />;
    case FieldType.Button:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={CursorButtonOutlinedPath} fill={fill} />;
    case FieldType.WorkDoc:
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnWorkdocPath} fill={fill} />;
    default:
      return null;
  }
});
