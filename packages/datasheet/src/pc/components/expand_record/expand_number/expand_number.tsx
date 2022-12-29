import { forwardRef, memo, useEffect } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { IEditor, IBaseEditorProps } from 'pc/components/editors/interface';
import { NumberEditor } from '../../editors/number_editor';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';

interface IExpandNumberProps extends IBaseEditorProps {
  isFocus: boolean;
  cellValue: number;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  className?: string;
  onBlur?: (...args: any) => void;
}

const ExpandNumberBase: React.ForwardRefRenderFunction<IEditor, IExpandNumberProps> = (props, ref) => {
  const { isFocus, field, cellValue, style, editable, editing, width, height, datasheetId, className, onSave, onBlur } = props;

  useEffect(() => {
    if (isFocus && editable && typeof ref === 'object') {
      ref?.current?.onStartEdit(cellValue);
      Promise.resolve().then(() => {
        ref?.current && ref.current.focus();
      });
    }
  }, [isFocus, editable, cellValue, ref]);

  return (
    <div className={styles.expandNumber}>
      <NumberEditor
        ref={ref}
        datasheetId={datasheetId}
        field={field}
        width={width}
        height={height}
        style={style}
        editable={editable}
        editing={editing}
        isFromFieldEditor
        onSave={onSave}
        onBlur={onBlur}
      />
      {
        editable && !isFocus && 
        <div className={styles.cellNumber}>
          <CellText cellValue={cellValue} field={field} className={className} />
        </div>
      }
    </div>
  );
};

export const ExpandNumber = memo(forwardRef(ExpandNumberBase));