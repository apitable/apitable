import { CollaCommandName, FieldType, ICellValue, IField, Selectors } from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { CellAttachment } from 'pc/components/multi_grid/cell/cell_attachment';
import { CellDateTime } from 'pc/components/multi_grid/cell/cell_date_time';
import { CellCreatedTime } from 'pc/components/multi_grid/cell/cell_created_time';
import { CellLink } from 'pc/components/multi_grid/cell/cell_link';
import { CellOptions } from 'pc/components/multi_grid/cell/cell_options';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { CellCheckbox } from '../cell_checkbox';
import { CellFormula } from '../cell_formula';
import { CellLookUp } from '../cell_lookup';
import { CellRating } from '../cell_rating';
import { CellMember } from '../cell_member';
import { CellCreatedBy } from '../cell_created_by';
import { CellAutoNumber } from '../cell_auto_number';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

export interface ICellValueComponent {
  field: IField;
  recordId: string;
  cellValue: ICellValue;
  datasheetId?: string;
  rowHeightLevel?: number;
  isActive?: boolean;
  className?: string;
  readonly?: boolean;
  cellTextClassName?: string;
  showAlarm?: boolean;
}

/**
 * CellValue 组件编写规范
 * 1. 组件参数只允许 ICellValueComponent 中的参数，不允许有额外的参数，如有需要请发起讨论。
 * 2. 子组件参数只允许接受 ICellComponentProps 为参数，一般不允许有额外的参数，如有需要请发起讨论，具体参数使用细节，请参考其定义中的注释
 */
const CellValueBase: React.FC<ICellValueComponent> = props => {
  const { field, recordId, cellValue, className, isActive, datasheetId, readonly, rowHeightLevel, cellTextClassName, showAlarm } = props;
  const commandManager = resourceService.instance!.commandManager;
  const cellEditable = useSelector(state => {
    return Selectors.getPermissions(state, datasheetId, field.id).cellEditable;
  });

  function onChange(value: ICellValue) {
    !readonly && commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data: [{
        recordId,
        fieldId: field.id,
        value,
      }],
    });
  }

  function toggleEdit() {
    ShortcutActionManager.trigger(ShortcutActionName.ToggleEditing);
  }

  const cellProps = {
    field, cellValue, className, onChange, isActive,
    toggleEdit, readonly: readonly || !cellEditable,
  };

  switch (field.type) {
    case FieldType.Text:
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Percent:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.SingleText:
      return(
        <CellText
          {...cellProps}
          rowHeightLevel={rowHeightLevel}
          className={classNames(cellTextClassName, className)}
        />);
    case FieldType.Rating:
      return <CellRating {...cellProps} field={field} />;
    case FieldType.Checkbox:
      return <CellCheckbox {...cellProps} field={field} />;
    case FieldType.DateTime:
      return <CellDateTime {...cellProps} field={field} recordId={recordId} showAlarm={showAlarm} />;
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
      return <CellCreatedTime {...cellProps} field={field} />;
    case FieldType.Attachment:
      return <CellAttachment
        {...cellProps}
        field={field}
        rowHeight={Selectors.getRowHeightFromLevel(rowHeightLevel)}
        recordId={recordId}
      />;
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return <CellOptions {...cellProps} rowHeightLevel={rowHeightLevel} />;
    case FieldType.Link:
      return <CellLink {...cellProps} field={field} rowHeightLevel={rowHeightLevel} datasheetId={datasheetId} />;
    case FieldType.Formula:
      return <CellFormula {...cellProps} field={field} recordId={recordId} rowHeightLevel={rowHeightLevel} />;
    case FieldType.LookUp:
      return <CellLookUp {...cellProps} field={field} recordId={recordId} rowHeightLevel={rowHeightLevel} />;
    case FieldType.Member:
      return <CellMember {...cellProps} field={field} rowHeightLevel={rowHeightLevel} />;
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return <CellCreatedBy {...cellProps} rowHeightLevel={rowHeightLevel} />;
    case FieldType.AutoNumber:
      return <CellAutoNumber {...cellProps} field={field} rowHeightLevel={rowHeightLevel} />;
    default:
      return <></>;
  }
};

export const CellValue = React.memo(CellValueBase);
