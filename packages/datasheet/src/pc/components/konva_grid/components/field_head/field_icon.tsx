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
  ColumnAttachmentFilled, ColumnAutonumberFilled, ColumnCheckboxFilled, ColumnCreatedbyFilled, ColumnCreatedtimeFilled,
  ColumnCurrencyFilled, ColumnFormulaFilled, ColumnLastmodifiedbyFilled, ColumnLastmodifiedtimeFilled,
  ColumnLongtextFilled, ColumnLookupNonzeroFilled, AccountFilled, ColumnPercentFilled, ColumnPhoneFilled, ColumnRatingFilled,
  ColumnMultipleFilled, ColumnSingleNonzeroFilled, ColumnUrlOutlined, ColumnFigureFilled, ColumnEmailNonzeroFilled,
  ColumnLinktableFilled, ColumnCalendarNonzeroFilled, ColumnTextNonzeroFilled, 
} from '@apitable/icons';
import { Icon } from 'pc/components/konva_components';

const ColumnLongtextFilledPath = ColumnLongtextFilled.toString();
const ColumnTextFilledPath = ColumnTextNonzeroFilled.toString();
const ColumnSingleFilledPath = ColumnSingleNonzeroFilled.toString();
const ColumnMultipleFilledPath = ColumnMultipleFilled.toString();
const ColumnCalendarFilledPath = ColumnCalendarNonzeroFilled.toString();
const ColumnAttachmentFilledPath = ColumnAttachmentFilled.toString();
const ColumnFigureFilledPath = ColumnFigureFilled.toString();
const ColumnLinktableFilledPath = ColumnLinktableFilled.toString();
const ColumnUrlOutlinedPath = ColumnUrlOutlined.toString();
const ColumnEmailFilledPath = ColumnEmailNonzeroFilled.toString();
const ColumnPhoneFilledPath = ColumnPhoneFilled.toString();
const ColumnAutonumberFilledPath = ColumnAutonumberFilled.toString();
const ColumnCheckboxFilledPath = ColumnCheckboxFilled.toString();
const ColumnCreatedbyFilledPath = ColumnCreatedbyFilled.toString();
const ColumnCreatedtimeFilledPath = ColumnCreatedtimeFilled.toString();
const ColumnCurrencyFilledPath = ColumnCurrencyFilled.toString();
const ColumnFormulaFilledPath = ColumnFormulaFilled.toString();
const ColumnLastmodifiedbyFilledPath = ColumnLastmodifiedbyFilled.toString();
const ColumnLastmodifiedtimeFilledPath = ColumnLastmodifiedtimeFilled.toString();
const ColumnLookupFilledPath = ColumnLookupNonzeroFilled.toString();
const ColumnMemberFilledPath = AccountFilled.toString();
const ColumnPercentFilledPath = ColumnPercentFilled.toString();
const ColumnRatingFilledPath = ColumnRatingFilled.toString();

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
      return <Icon x={x} y={y} size={width} backgroundHeight={height} listening={false} data={ColumnLinktableFilledPath} fill={fill} />;
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
    default:
      return null;
  }
});