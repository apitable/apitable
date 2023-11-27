import * as React from 'react';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { ICellValue, Navigation, Selectors } from '@apitable/core';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { IBaseEditorProps, IEditor } from '../interface';
// @ts-ignore
import { Workdoc } from 'enterprise/editor/workdoc/workdoc';

export interface IWorkdocEditorProps extends IBaseEditorProps {
  editable: boolean;
  editing?: boolean;
  cellValue?: ICellValue;
  datasheetId: string;
  toggleEditing?: (next?: boolean) => void;
  recordId?: string;
  onSave?: (val: any) => void;
}

const WorkdocEditorBase: React.ForwardRefRenderFunction<IEditor, IWorkdocEditorProps> = (props, ref) => {
  const { onSave, datasheetId, recordId, field, cellValue, editable, editing = false, toggleEditing } = props;
  const viewId = useAppSelector((state) => Selectors.getActiveViewId(state))!;

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

  const focus = () => {
  };

  const onEndEdit = () => {};

  const saveValue = () => {};

  const onStartEdit = () => {
    Router.replace(Navigation.WORKBENCH, {
      params: {
        nodeId: datasheetId,
        datasheetId,
        viewId,
      },
      query: {
        recordId,
        fieldId: field.id
      }
    });
  };

  return (
    <Workdoc
      datasheetId={datasheetId}
      cellValue={cellValue}
      editing={editing}
      toggleEditing={toggleEditing}
      fieldId={field!.id}
      recordId={recordId ? recordId.endsWith('_temp') ? undefined : recordId : undefined}
      onSave={onSave}
      editable={editable}
    />
  );
};

export const WorkdocEditor = memo(forwardRef(WorkdocEditorBase));
