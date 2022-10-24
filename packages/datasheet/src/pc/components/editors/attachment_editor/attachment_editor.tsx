import { forwardRef, useImperativeHandle, useRef, memo } from 'react';
import * as React from 'react';
import { IEditorProps } from '../options_editor';
import { IEditor } from '../interface';
import { FocusHolder } from '../focus_holder';
import { UploadModal } from 'pc/components/upload_modal';
import { IAttachmentValue } from '@apitable/core';

interface IAttachmentEditorProps {
  cellValue: IAttachmentValue[];
  recordId: string;
  editable: boolean;
}

export const AttachmentEditorBase: React.ForwardRefRenderFunction<IEditor, IEditorProps & IAttachmentEditorProps> = (props, ref) => {
  const {
    recordId,
    field,
    editing,
    datasheetId,
    cellValue,
    onSave,
  } = props;
  const inputRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, (): IEditor => ({
    focus: () => {
      inputRef.current && inputRef.current.focus();
    },
    onEndEdit: () => { return; },
    onStartEdit: () => { return; },
    setValue: () => { return; },
    saveValue: () => { return; },
  }));

  return (
    <>
      {/* 这里的input只是为了保持聚焦状态，方便 shortKey 为 space 时展开record */}
      <FocusHolder ref={inputRef} />
      {
        editing && !props.disabled && (
          <UploadModal
            field={field}
            recordId={recordId}
            datasheetId={datasheetId}
            cellValue={cellValue}
            onSave={onSave}
          />
        )
      }
    </>
  );
};

export const AttachmentEditor = memo(forwardRef(AttachmentEditorBase));
