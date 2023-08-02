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

import React, { CSSProperties, useContext } from 'react';
import { FieldType, IWidgetContext } from '../../interface';
import { WidgetContext } from 'context/widget_context';
import { useRecord, useField } from '../../hooks';
import { CellText } from './cell_text';
import { CellOptions } from './cell_options';
import { CellAttachment } from './cell_attachment';
import { CellRating } from './cell_rating';
import { CellMember } from './cell_member';
import { CellCheckbox } from './cell_checkbox';
import { CellPhone } from './cell_phone';
import { CellUrl } from './cell_url';
import { CellEmail } from './cell_email';
import { CellLink } from './cell_link';
import { CellEnhanceText } from './cell_enhance_text';
import { Field, getFieldTypeString, IReduxState, LookUpField } from '../../core';
import { CellMultiText } from './cell_multi_text';

/**
 * Display the UI style for recording the cells of the specified field, 
 * all types of fields are now supported.
 * 
 * @param props.recordId The recordId from which to render a cell.
 * @param props.fieldId The fieldId from which to render a cell.
 * @param props.cellValue The cell value to render. 
 * Either record or cellValue must be provided to the CellValue. If both are provided, record will be used.
 * @param props.className Additional class names to apply to the cell renderer container, separated by spaces.
 * @param props.style Additional styles to apply to the cell renderer container.
 * @param props.cellClassName Additional class names to apply to the cell itself, separated by spaces.
 * @param props.cellStyle Additional styles to apply to the cell itself.
 * @returns
 * 
 * #### Example
 * 
 * **Method 1**
 * 
 * Use recordId,fieldId render CellValue UI, 
 * Rendering CellValue UI by recordId, fieldId, e.g. focus cell's rendering cell display UI.
 * 
 * ```tsx
 * import React from 'react';
 * import { useActiveCell, CellValue } from '@apitable/widget-sdk';
 * 
 * export const CellValueUI = () => {
 *   const activeCell = useActiveCell();
 *   if (!activeCell) {
 *     return <p>Cells without activation</p>
 *   }
 *  const { recordId, fieldId } = activeCell;
 *   return (
 *     <CellValue
 *       className="wrapperClass"
 *       cellClassName="cellClass"
 *       recordId={recordId}
 *       fieldId={fieldId}
 *     />
 *   )
 * }
 * ```
 * 
 *  **Method 2**
 * 
 * Render CellValue UI by cellValue, fieldId, 
 * e.g. merge or difference set calculation for multiple cells data in the same column, return data in cellValue format.
 * 
 * ```tsx
 * import React from 'react';
 * import { useActiveCell, CellValue } from '@apitable/widget-sdk';
 * 
 * export const CellValueUI = ({ cellValue }) => {
 *   const activeCell = useActiveCell();
 *   if (!activeCell) {
 *     return <p>Cells without activation</p>
 *   }
 *  const { fieldId } = activeCell;
 *   return (
 *     <CellValue
 *       className="wrapperClass"
 *       cellClassName="cellClass"
 *       cellValue={cellValue}
 *       fieldId={fieldId}
 *     />
 *   )
 * }
 * ```
 */
export const CellValue = (props: {
  recordId?: string;
  fieldId: string;
  cellValue?: unknown;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}) => {
  const context = useContext<IWidgetContext>(WidgetContext);
  const { recordId, fieldId, className, style, cellClassName, cellStyle, cellValue: cellValueData } = props;
  const wrapperProps = { className, style };
  const cellProps = { cellClassName, cellStyle };
  const activeRecord = useRecord(recordId);
  const activeField = useField(fieldId);
  let type = activeField?.type;
  let property = activeField?.fieldData?.property;
  const state = context.widgetStore.getState();
  if (!activeField ||!type || !state) {
    return null;
  }
  let cellValue = cellValueData || activeRecord.getCellValue(fieldId);
  if (type === FieldType.MagicLookUp) {
    const realField = (Field.bindModel(activeField.fieldData, state as any as IReduxState) as LookUpField).getLookUpEntityField();
    const realType = realField?.type;
    if (!realType) {
      return null;
    }
    type = getFieldTypeString(realType) as any as FieldType;
    if (
      type === FieldType.Attachment ||
      type === FieldType.MultiSelect ||
      type === FieldType.Member ||
      type === FieldType.MagicLink
    ) {
      cellValue = cellValue ? cellValue[0] : null;
    }
    if (
      type === FieldType.MultiSelect ||
      type === FieldType.SingleSelect ||
      type === FieldType.Checkbox
    ) {
      property = realField?.property;
    }
    if (
      type === FieldType.Email ||
      type === FieldType.URL || 
      type === FieldType.Phone || 
      type === FieldType.Rating
    ) {
      type = FieldType.Text;
    }
  }

  const handleCellValue = () => {
    return cellValueData ? activeField.convertCellValueToString(cellValueData) : activeRecord.getCellValueString(fieldId);
  };

  switch(type) {
    case FieldType.SingleText:
      return <CellEnhanceText text={handleCellValue()} {...cellProps} />;
    case FieldType.Text:
      return <CellMultiText text={handleCellValue()} {...cellProps}/>;
    case FieldType.Currency:
    case FieldType.DateTime:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
    case FieldType.Percent:
    case FieldType.AutoNumber:
    case FieldType.Number:
    case FieldType.Formula:
      return <CellText text={handleCellValue()} {...cellProps} />;
    case FieldType.MultiSelect:
    case FieldType.SingleSelect:
      return <CellOptions options={property?.options} selectOptions={cellValue} {...cellProps} {...wrapperProps} />;
    case FieldType.Attachment:
      return <CellAttachment files={cellValue} {...cellProps} {...wrapperProps} />;
    case FieldType.Rating:
      return <CellRating field={property} count={cellValue} {...cellProps} {...wrapperProps} />;
    case FieldType.Member:
    case FieldType.LastModifiedBy:
    case FieldType.CreatedBy:
      return <CellMember members={cellValue} {...cellProps} {...wrapperProps} />;
    case FieldType.Checkbox:
      return <CellCheckbox field={property} checked={cellValue} {...cellProps} {...wrapperProps} />;
    case FieldType.Phone:
      return <CellPhone value={cellValue} {...cellProps} />;
    case FieldType.Email:
      return <CellEmail value={cellValue} {...cellProps} />;
    case FieldType.URL:
      return <CellUrl value={cellValue} {...cellProps} />;
    case FieldType.MagicLink:
      return <CellLink options={cellValue} {...cellProps} {...wrapperProps} />;
    default:
      return <span>Not support</span>;
  }
};