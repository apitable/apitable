import { CollaCommandName, FieldType, ICellValue, IField } from '@vikadata/core';
import { ShapeConfig } from 'konva/lib/Shape';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { resourceService } from 'pc/resource_service';
import { FC, memo } from 'react';
import { CellScrollContainer } from '../cell_scroll_container';
import { CellAttachment } from './cell_attachment';
import { CellCheckbox } from './cell_checkbox';
import { CellFormula } from './cell_formula';
import { CellLink } from './cell_link';
import { CellLookUp } from './cell_lookup';
import { CellMember } from './cell_member';
import { CellMultiSelect } from './cell_multi_select';
import { CellRating } from './cell_rating';
import { CellSingleSelect } from './cell_single_select';
import { CellText } from './cell_text';
import { IRenderData } from './interface';

export interface ICellProps {
  field: IField;
  recordId: string;
  x: number;
  y: number;
  rowHeight: number;
  columnWidth: number;
  cellValue: ICellValue;
  renderData: IRenderData;
  isActive?: boolean;
  editable?: boolean;
  style?: ShapeConfig;
  toggleEdit?: () => void;
  onChange?: (value: ICellValue) => void;
  disabledDownload?: boolean;
}

export interface ICellValueProps {
  x: number;
  y: number;
  rowHeight: number;
  columnWidth: number;
  field: IField;
  recordId: string;
  cellValue: ICellValue;
  renderData: IRenderData;
  datasheetId: string;
  editable?: boolean;
  isActive?: boolean;
  style?: ShapeConfig & { background?: string };
  disabledDownload?: boolean;
}

export const CellValue: FC<ICellValueProps> = memo((props) => {
  const {
    x,
    y,
    rowHeight,
    columnWidth,
    field,
    recordId,
    isActive,
    editable,
    datasheetId,
    style,
    renderData,
    cellValue,
    disabledDownload
  } = props;
  const commandManager = resourceService.instance!.commandManager;

  const onChange = (value: ICellValue) => {
    editable &&
    commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data: [{
        recordId,
        fieldId: field.id,
        value,
      }],
    });
  };

  const toggleEdit = () => {
    ShortcutActionManager.trigger(ShortcutActionName.ToggleEditing);
  };

  const cellProps: ICellProps = {
    field,
    recordId,
    onChange,
    isActive,
    toggleEdit,
    editable,
    x,
    y,
    rowHeight,
    columnWidth,
    style,
    renderData,
    cellValue,
    disabledDownload
  };

  switch (field.type) {
    case FieldType.Text:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.Phone:
    case FieldType.SingleText:
    case FieldType.DateTime:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
      return <CellText {...cellProps} />;
    case FieldType.SingleSelect:
      return <CellSingleSelect {...cellProps} />;
    case FieldType.MultiSelect:
      return <CellMultiSelect {...cellProps} />;
    case FieldType.Member:
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return <CellMember {...cellProps} />;
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Percent:
    case FieldType.AutoNumber:
      return (
        <CellScrollContainer
          x={x}
          y={y}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
          fieldId={field.id}
          recordId={recordId}
          renderData={renderData}
        />
      );
    case FieldType.Checkbox:
      return <CellCheckbox {...cellProps} />;
    case FieldType.Rating:
      return <CellRating {...cellProps} />;
    case FieldType.Formula:
      return <CellFormula {...cellProps} />;
    case FieldType.Link:
      return <CellLink {...cellProps} />;
    case FieldType.LookUp:
      return <CellLookUp {...cellProps} />;
    case FieldType.Attachment:
      return <CellAttachment {...cellProps} />;
    default:
      return null;
  }
});
