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

import * as React from 'react';
import { useContext, useMemo } from 'react';
import {
  BasicValueType,
  Field,
  FieldType,
  handleNullArray,
  ILookUpField,
  LOOKUP_VALUE_FUNC_SET,
  LookUpField,
  ORIGIN_VALUES_FUNC_SET,
  RollUpFuncType,
} from '@apitable/core';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { CellAttachment } from '../cell_attachment';
import { CellCheckbox } from '../cell_checkbox';
import { CellLink } from '../cell_link';
import { CellMember } from '../cell_member';
import { CellMultiSelect } from '../cell_multi_select';
import { CellText } from '../cell_text';
import { ICellProps } from '../cell_value';

const CellPlaceHolder = (props: { rowHeight: number }) => {
  const { rowHeight } = props;
  const { setActiveCellBound } = useContext(KonvaGridContext);
  useMemo(() => setActiveCellBound({ height: rowHeight }), [rowHeight, setActiveCellBound]);
  return null;
};

export const CellLookUp: React.FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { field, cellValue: originCellValue, rowHeight } = props;
  const cellValue = handleNullArray(originCellValue);
  const realField = (Field.bindModel(field) as LookUpField).getLookUpEntityField();
  const valueType = (Field.bindModel(field) as LookUpField).basicValueType;

  if (cellValue == null || !realField) return <CellPlaceHolder rowHeight={rowHeight} />;

  const rollUpType = (field as ILookUpField).property.rollUpType || RollUpFuncType.VALUES;
  const commonProps = { ...props, cellValue, editable: false };

  if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType)) {
    switch (valueType) {
      case BasicValueType.String:
      case BasicValueType.Number:
        return <CellText {...commonProps} />;
      case BasicValueType.Boolean:
        return <CellCheckbox {...commonProps} />;
      case BasicValueType.Array:
      default:
        break;
    }
  }

  if (!Array.isArray(cellValue)) {
    return <CellText {...commonProps} />;
  }

  if (LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
    return <CellText {...commonProps} />;
  }

  // Non-plain text fields are displayed as-is.
  switch (realField.type) {
    case FieldType.Attachment:
      return <CellAttachment {...commonProps} />;
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return <CellMultiSelect {...commonProps} />;
    case FieldType.Member:
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return <CellMember {...commonProps} />;
    case FieldType.Checkbox:
      return <CellPlaceHolder rowHeight={rowHeight} />;
    case FieldType.Link:
    case FieldType.OneWayLink:
      return <CellLink {...commonProps} />;
    // Text comma splitting
    case FieldType.Number:
    case FieldType.Percent:
    case FieldType.Currency:
    case FieldType.AutoNumber:
    case FieldType.DateTime:
    case FieldType.Text:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.URL:
    case FieldType.Rating:
    case FieldType.Formula:
    case FieldType.SingleText:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
    case FieldType.Cascader:
    case FieldType.Button:
    case FieldType.WorkDoc:
      return <CellText {...commonProps} />;
    case FieldType.NotSupport:
    default:
      return <CellPlaceHolder rowHeight={rowHeight} />;
  }
};
