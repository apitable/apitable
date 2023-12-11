import Router from 'next/router';
import * as React from 'react';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { ICellValue } from '@apitable/core';
import { IBaseEditorProps, IEditor } from '../interface';
// @ts-ignore
import { Workdoc } from 'enterprise/editor/workdoc';

export interface IWorkdocEditorProps extends IBaseEditorProps {
  editable: boolean;
  editing?: boolean;
  cellValue?: ICellValue;
  datasheetId: string;
  toggleEditing?: (next?: boolean) => void;
  recordId: string;
  onSave?: (val: any) => void;
}

const WorkdocEditorBase: React.ForwardRefRenderFunction<IEditor, IWorkdocEditorProps> = (props, ref) => {
  const { onSave, datasheetId, recordId, field, cellValue, editable, editing = false, toggleEditing } = props;

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        focus();
      },
      onEndEdit: () => {
        onEndEdit();
      },
      onStartEdit: () => {
        onStartEdit();
      },
      setValue: () => {
        onStartEdit();
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  const focus = () => {};

  const onEndEdit = () => {};

  const saveValue = () => {};

  const onStartEdit = () => {
    // query add recordId and fieldId
    const url = Router.asPath;
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('recordId', recordId);
    urlObj.searchParams.set('fieldId', field.id);
    Router.replace(urlObj.toString());
  };

  return (
    <Workdoc
      datasheetId={datasheetId}
      cellValue={cellValue}
      editing={editing}
      toggleEditing={toggleEditing}
      fieldId={field!.id}
      recordId={recordId ? (recordId.endsWith('_temp') ? undefined : recordId) : undefined}
      onSave={onSave}
      editable={editable}
    />
  );
};

export const WorkdocEditor = memo(forwardRef(WorkdocEditorBase));
