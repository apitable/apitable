import classNames from 'classnames';
import { get } from 'lodash';
import { memo, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef, useState } from 'react';
import { IconButton } from '@apitable/components';
import { ICellValue, IField, Strings, t } from '@apitable/core';
import { AddOutlined, FileOutlined } from '@apitable/icons';
import { IEditor } from 'pc/components/editors/interface';
// @ts-ignore
import { Workdoc } from 'enterprise/editor/workdoc/workdoc';
import styles from './styles.module.less';

interface IWorkdocProps {
  cellValue?: ICellValue;
  editing?: boolean;
  editable: boolean;
  className?: string;
  datasheetId: string;
  recordId?: string;
  field: IField;
  onSave?: (val: any) => void;
}

const ExpandWorkdocBase: ForwardRefRenderFunction<IEditor, IWorkdocProps> = (props, ref) => {
  const { field, cellValue, datasheetId, recordId, onSave, editable } = props;
  const workdocRef = useRef<any>(null);

  const title = get(cellValue, '0.title') || t(Strings.workdoc_unnamed);

  const [open, setOpen] = useState(false);
  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => workdocRef.current && workdocRef.current!.focus(),
      onEndEdit: () => {},
      onStartEdit: () => onStartEdit(),
      setValue: () => onStartEdit(),
      saveValue: () => {},
    }),
  );

  const onStartEdit = () => {};

  const toggleEditing = () => {
    setOpen(!open);
  };

  return (
    <>
      {cellValue == null ? (
        editable ? (
          <div className={classNames('createWorkdoc', styles.createWorkdoc)}>
            <IconButton icon={AddOutlined} onClick={toggleEditing} />
            <div>{t(Strings.workdoc_create)}</div>
          </div>
        ) : null
      ) : (
        <div className={classNames('expandWorkdoc', styles.expandWorkdoc)}>
          <div className={classNames('workdocBtn', styles.workdocBtn)} onClick={toggleEditing}>
            <FileOutlined />
            <div className={styles.workdocTitle}>{title}</div>
          </div>
        </div>
      )}
      <Workdoc
        datasheetId={datasheetId}
        cellValue={cellValue}
        editing={open}
        toggleEditing={toggleEditing}
        recordId={recordId}
        fieldId={field!.id}
        onSave={onSave}
        editable={editable}
      />
    </>
  );
};

export const ExpandWorkdoc = memo(forwardRef(ExpandWorkdocBase));
