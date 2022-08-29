import { ICellValue } from '@vikadata/core';
import { DateTimeEditor, IDateTimeEditorProps } from 'pc/components/editors/date_time_editor';
import { CellDateTime } from 'pc/components/multi_grid/cell/cell_date_time';
import { forwardRef } from 'react';
import * as React from 'react';
import { IExpandFieldEditRef } from '../field_editor';
import style from './style.module.less';

interface IExpandDateTimeEditorProps {
  commonProps: IDateTimeEditorProps,
  isFocus: boolean;
  cellValue: ICellValue;
  showAlarm?: boolean;
}

const ExpandDateTimeEditorBase: React.ForwardRefRenderFunction<IExpandFieldEditRef, IExpandDateTimeEditorProps> = (props, ref) => {

  const {
    commonProps,
    isFocus,
    cellValue,
    showAlarm
  } = props;
  return (
    <>
      <DateTimeEditor
        {...commonProps}
        ref={ele => (ref as any).current = ele}
        showAlarm={showAlarm}
      />
      {
        commonProps.editable && !isFocus &&
        <div className={style.overlay}>
          <CellDateTime
            cellValue={cellValue}
            field={commonProps.field}
            recordId={commonProps.recordId}
            showAlarm={showAlarm}
          />
        </div>
      }
    </>
  );
};

export const ExpandDateTimeEditor = forwardRef(ExpandDateTimeEditorBase);
