import {
  BasicValueType, Field, FieldType, ILinkField, ILookUpField,
  RollUpFuncType, ICellValue, ILinkIds,
  ORIGIN_VALUES_FUNC_SET, LOOKUP_VALUE_FUNC_SET, assertNever, IAttachmentValue, handleNullArray, IDateTimeField,
} from '@apitable/core';
import { IBaseEditorProps } from 'pc/components/editors/interface';
import { CellMultiCheckbox } from 'pc/components/multi_grid/cell/cell_lookup/cell_multi_checkbox';
import { CellMember } from 'pc/components/multi_grid/cell/cell_member';
import { CellCreatedBy } from 'pc/components/multi_grid/cell/cell_created_by';
import { CellCreatedTime } from 'pc/components/multi_grid/cell/cell_created_time';
import { CellOptions } from 'pc/components/multi_grid/cell/cell_options';
import { useComputeCellValue } from 'pc/hooks/use_cellvalue';
import { memo } from 'react';
import { ExpandAttachment } from '../expand_attachment';
import { ExpandLink } from '../expand_link';
import styles from '../field_editor/style.module.less';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';
import { CellCheckbox } from 'pc/components/multi_grid/cell/cell_checkbox';
import { CellDateTime } from 'pc/components/multi_grid/cell/cell_date_time';
import expandRecordStyles from '../style.module.less';

interface IExpandLookUp extends IBaseEditorProps {
  recordId: string;
  field: ILookUpField;
}

export function ExpandLookUpBase(props: IExpandLookUp) {
  const { field, recordId } = props;
  const entityField = Field.bindModel(field).getLookUpEntityField();
  const originalCellValue = useComputeCellValue({
    recordId,
    field: field,
  });
  let cellValue = handleNullArray(originalCellValue);
  const valueType = Field.bindModel(field).basicValueType;
  if (!recordId || cellValue == null || !entityField) return null;

  const rollUpType = field.property.rollUpType || RollUpFuncType.VALUES;

  // https://github.com/vikadata/vikadata/issues/1229#issuecomment-1275546897
  // 根据 issue 里的描述，这里就是在寻找正确的跳板（datasheet）的 id
  const getCurrentDatasheetIdFromLinkDatasheetId = () => {
    if (entityField.type !== FieldType.Link) return props.datasheetId;

    const entityFieldInfo = Field.bindModel(field).getLookUpEntityFieldInfo();

    if (!entityFieldInfo) return props.datasheetId;

    return entityFieldInfo.datasheetId;
  };

  if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType)) {
    switch (valueType) {
      case BasicValueType.String:
      case BasicValueType.Number:
        return (
          <CellText
            cellValue={cellValue as any}
            className={styles.expandCellString}
            field={field}
          />
        );
      case BasicValueType.Boolean:
        return (
          <CellCheckbox
            className={expandRecordStyles.expandFormulaCheckbox}
            cellValue={cellValue as any}
            field={field}
          />
        );
      case BasicValueType.DateTime:
        return (
          <CellDateTime
            cellValue={cellValue as any}
            field={entityField as IDateTimeField}
          />
        );
      case BasicValueType.Array:
      default:
        break;
    }
  }

  if (!Array.isArray(cellValue)) {
    return <></>;
  }

  // cellValue 神奇引用 尝试去拍平二维数组
  cellValue = cellValue?.flat(1) as ICellValue;

  if (LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
    return (
      <CellText
        className={styles.expandCellText}
        cellValue={cellValue as any}
        field={field}
      />
    );
  }

  const realType = entityField.type;
  switch (realType) {
    case FieldType.Checkbox:
      return (
        <CellMultiCheckbox
          cellValue={cellValue as ICellValue}
          field={entityField}
          readonly
        />
      );
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return (
        <CellOptions
          field={entityField}
          cellValue={cellValue as ICellValue}
          keyPrefix={`${recordId}-${field.id}`}
        />
      );
    case FieldType.Member:
      return (
        <CellMember
          field={entityField}
          cellValue={cellValue as ICellValue}
          keyPrefix={`${recordId}-${field.id}`}
        />
      );
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return (
        <CellCreatedBy
          field={entityField}
          cellValue={cellValue as ICellValue}
          isFromExpand
        />
      );
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
      return (
        <CellCreatedTime
          field={entityField}
          cellValue={cellValue as ICellValue}
          isFromExpand
        />
      );
    case FieldType.Attachment:
      return (
        <ExpandAttachment
          {...props}
          field={field}
          recordId={recordId}
          cellValue={cellValue as IAttachmentValue[]}
          onClick={() => undefined}
          editable={false}
          keyPrefix={`${recordId}-${field.id}`}
        />
      );
    case FieldType.Link:
      return (
        <ExpandLink
          {...props}
          field={entityField as ILinkField}
          onClick={() => undefined}
          editable={false}
          editing={false}
          style={{}}
          cellValue={cellValue as ILinkIds}
          keyPrefix={`${recordId}-${field.id}`}
          datasheetId={getCurrentDatasheetIdFromLinkDatasheetId()}
        />
      );
    // 文本逗号分割
    case FieldType.DateTime:
    case FieldType.Number:
    case FieldType.Percent:
    case FieldType.Currency:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.URL:
    case FieldType.Rating:
    case FieldType.Formula:
    case FieldType.SingleText:
    case FieldType.AutoNumber:
      return (
        <CellText
          cellValue={cellValue as any}
          field={field}
        />
      );
    case FieldType.Text:
      return (
        <CellText
          className={styles.expandCellText}
          cellValue={cellValue as any}
          field={field}
        />
      );
    case FieldType.NotSupport:
    case FieldType.LookUp:
    case FieldType.DeniedField:
      return null;
    default:
      assertNever(realType);
      return null;
  }
}

export const ExpandLookUp = memo((props: IExpandLookUp) => {
  return (
    <ExpandLookUpBase {...props} />
  );
});
