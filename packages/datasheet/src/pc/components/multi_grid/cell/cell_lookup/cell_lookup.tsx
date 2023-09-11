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

import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import * as React from 'react';
import {
  BasicValueType,
  Field,
  FieldType,
  ORIGIN_VALUES_FUNC_SET,
  LOOKUP_VALUE_FUNC_SET,
  IAttachmentValue,
  ILinkIds,
  ILookUpField,
  IMultiSelectedIds,
  ISegment,
  IUnitIds,
  RollUpFuncType,
  Strings,
  t,
  Selectors,
  RowHeightLevel,
  ICellValue,
  handleNullArray,
  IDateTimeField,
} from '@apitable/core';
import { CellAttachment } from 'pc/components/multi_grid/cell/cell_attachment';
import { store } from 'pc/store';
import { CellCheckbox } from '../cell_checkbox';
import { CellCreatedBy } from '../cell_created_by';
import { CellDateTime } from '../cell_date_time';
import { CellLink } from '../cell_link';
import { CellMember } from '../cell_member';
import { CellOptions } from '../cell_options';
import { CellText } from '../cell_text';
import { ICellComponentProps } from '../cell_value/interface';
import { CellMultiCheckbox } from './cell_multi_checkbox';

interface ICellLookUpProps extends ICellComponentProps {
  field: ILookUpField;
  recordId: string;
  rowHeightLevel?: RowHeightLevel;
}

export const CellLookUpBase: React.FC<React.PropsWithChildren<ICellLookUpProps>> = (props) => {
  const { field, recordId, isActive, className, rowHeightLevel, cellValue: originalCellValue } = props;
  let cellValue = handleNullArray(originalCellValue);
  const realField = Field.bindModel(field).getLookUpEntityField();
  const valueType = Field.bindModel(field).basicValueType;

  const rowHeight = Selectors.getRowHeightFromLevel(rowHeightLevel);
  if (cellValue == null || !realField) return <></>;

  const rollUpType = field.property.rollUpType || RollUpFuncType.VALUES;
  if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType)) {
    switch (valueType) {
      case BasicValueType.String:
      case BasicValueType.Number:
        return <CellText className={className} cellValue={cellValue as any} rowHeightLevel={rowHeightLevel} field={field} />;
      case BasicValueType.Boolean:
        return <CellCheckbox className={className} cellValue={cellValue as any} field={field} />;
      case BasicValueType.DateTime:
        return <CellDateTime className={className} cellValue={cellValue as any} field={realField as IDateTimeField} />;
      case BasicValueType.Array:
      default:
        break;
    }
  }

  if (!Array.isArray(cellValue)) {
    return <></>;
  }

  cellValue = cellValue?.flat(1) as ICellValue;

  if (LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
    return <CellText className={className} cellValue={cellValue as any} rowHeightLevel={rowHeightLevel} field={field} />;
  }

  switch (realField.type) {
    // Non-plain text fields are displayed as is
    case FieldType.Attachment:
      return (
        <CellAttachment
          className={className}
          isActive={isActive}
          cellValue={cellValue as IAttachmentValue[]}
          field={realField}
          keyPrefix={`${recordId}-${field.id}`}
          rowHeight={rowHeight}
          readonly
          recordId={recordId}
        />
      );
    case FieldType.MultiSelect:
    case FieldType.SingleSelect:
      return (
        <CellOptions
          className={className}
          cellValue={cellValue as IMultiSelectedIds}
          field={field}
          keyPrefix={`${recordId}-${field.id}`}
          rowHeightLevel={rowHeightLevel}
          readonly
        />
      );
    case FieldType.Member:
      return (
        <CellMember
          className={className}
          cellValue={cellValue as IUnitIds}
          field={realField}
          keyPrefix={`${recordId}-${realField.id}`}
          rowHeightLevel={rowHeightLevel}
          readonly
        />
      );
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return (
        <CellCreatedBy
          className={className}
          cellValue={cellValue as IUnitIds}
          field={field}
          keyPrefix={`${recordId}-${field.id}`}
          readonly
          rowHeightLevel={rowHeightLevel}
        />
      );
    case FieldType.Link:
      return (
        <CellLink
          className={className}
          isActive={isActive}
          cellValue={cellValue as ILinkIds}
          field={realField}
          keyPrefix={`${recordId}-${field.id}`}
          rowHeightLevel={rowHeightLevel}
          readonly
        />
      );
    case FieldType.Checkbox:
      return <CellMultiCheckbox className={className} cellValue={cellValue as ISegment[]} field={field} readonly />;
    // Text comma segmentation
    case FieldType.DateTime:
    case FieldType.Number:
    case FieldType.Text:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.URL:
    case FieldType.Rating:
    case FieldType.Formula:
    case FieldType.Percent:
    case FieldType.Currency:
    case FieldType.SingleText:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
    case FieldType.AutoNumber:
      return <CellText className={className} cellValue={cellValue as any} rowHeightLevel={rowHeightLevel} field={field} />;
    case FieldType.NotSupport:
    default:
      return <></>;
  }
};

export const CellLookUp: React.FC<React.PropsWithChildren<ICellLookUpProps>> = (props) => {
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    setShowTip(false);
  }, [props.isActive]);

  const handleDbClick = () => {
    const state = store.getState();
    const permissions = Selectors.getPermissions(state);
    if (permissions.cellEditable) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 2000);
    }
  };

  return (
    <div onDoubleClick={handleDbClick} style={{ width: '100%' }}>
      {showTip ? (
        <Tooltip title={t(Strings.lookup_check_info)} visible={showTip} placement="top" autoAdjustOverflow>
          <div>
            <CellLookUpBase {...props} />
          </div>
        </Tooltip>
      ) : (
        <CellLookUpBase {...props} />
      )}
    </div>
  );
};
