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
import { Field, getFieldTypeString, LookUpField } from '../../core';
import { CellMultiText } from './cell_multi_text';

/**
 * 显示记录指定字段单元格的 UI 样式，目前已经支持所有类型字段。
 * 
 * @param props.recordId 行记录 ID
 * @param props.fieldId 列字段 ID
 * @param props.cellValue 符合类字段对应的格式化数据，可能是多个单元格并集、差集
 * @param props.className 样式类
 * @param props.style 行内样式
 * @param props.cellClassName 子元素样式类
 * @param props.cellStyle 子元素行内样式
 * @returns
 * 
 * #### 示例
 * 
 * **方法一**
 * 
 * 通过 recordId、fieldId 渲染 CellValue UI，比如 foucs 单元的渲染单元格显示的 UI：
 * 
 * ```tsx
 * import React from 'react';
 * import { useActiveCell, CellValue } from '@vikadata/widget-sdk';
 * 
 * export const CellValueUI = () => {
 *   const activeCell = useActiveCell();
 *   if (!activeCell) {
 *     return <p>无激活的单元格</p>
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
 *  **方法二**
 * 
 * 通过 cellValue、fieldId 渲染 CellValue UI，比如对同列多个单元格数据进行合并或差集计算，返回 cellValue 格式的数据：
 * 
 * ```tsx
 * import React from 'react';
 * import { useActiveCell, CellValue } from '@vikadata/widget-sdk';
 * 
 * export const CellValueUI = ({ cellValue }) => {
 *   const activeCell = useActiveCell();
 *   if (!activeCell) {
 *     return <p>无激活的单元格</p>
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
  const state = context.globalStore.getState();
  if (!activeField ||!type || !state) {
    return null;
  }
  let cellValue = cellValueData || activeRecord.getCellValue(fieldId);
  if (type === FieldType.MagicLookUp) {
    const realField = (Field.bindModel(activeField.fieldData, state) as LookUpField).getLookUpEntityField();
    const realType = realField?.type;
    if (!realType) {
      return null;
    }
    type = getFieldTypeString(realType);
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
      return <span>不支持</span>;
  }
};