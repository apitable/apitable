import { message } from 'antd';
import * as React from 'react';
import { forwardRef, memo, useImperativeHandle } from 'react';
import {
  ButtonActionType,
  evaluate,
  IButtonField,
  ICellValue,
  IReduxState,
  OpenLinkType,
  Strings,
  t
  , IRecord } from '@apitable/core';
import { getSnapshot } from '@apitable/core/dist/modules/database/store/selectors/resource';
import { reqDatasheetButtonTrigger } from 'pc/components/robot/api';
import { IBaseEditorProps, IEditor } from '../interface';
import { ButtonFieldItem } from './buton_item';

export interface IButtonEditorProps extends IBaseEditorProps {
  editable: boolean;
  editing?: boolean;
  cellValue?: ICellValue;
  record?: IRecord,
  datasheetId: string;
  toggleEditing?: (next?: boolean) => void;
  field: IButtonField;
  recordId?: string;
  onSave?: (val: any) => void;
}

let isRunning = false;

export interface IRunRespStatus {
 success:boolean, message: string
}

export const runAutomationButton = async (datasheetId: string, record: any, state: IReduxState, recordId: string, fieldId: string, field: IButtonField,
  callback: () => void
) : Promise<any|undefined>=> {
  if(field.property.action.type === ButtonActionType.OpenLink) {

    if(field.property.action.openLink?.type === OpenLinkType.Url ) {
      window.open(field.property.action.openLink?.expression, '_blank');
    }else {
      const expression = field.property.action.openLink?.expression ?? '';

      const url = evaluate(expression, { field, record, state }, false);

      window.open(String(url), '_blank');

    }

    callback();
    return;
  }

  // TODO width poll call function
  if(field.property.action.type === ButtonActionType.TriggerAutomation) {
    if(isRunning) {
      callback();
      message.warn(t(Strings.refresh_and_close_page_when_automation_queue));
      return;
    }

    try {
      isRunning= true;
      const respTrigger = await reqDatasheetButtonTrigger({
        dstId: datasheetId,
        recordId,
        fieldId,
      });
      isRunning= false;
      const respData = respTrigger?.data as IRunRespStatus;
      // TODO status run status
      if(!respData?.success) {
        message.error(respData?.message);
      }
      callback();
      return respTrigger;
    } catch (e) {
      isRunning= false;
      callback();
      return undefined;
    }
  }
};

const ButtonEditorBase: React.ForwardRefRenderFunction<IEditor, IButtonEditorProps> = (props, ref) => {
  const { recordId, record, field, cellValue, editable, editing = false, toggleEditing } = props;
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

  const onStartEdit = () => {};

  return (
    <>
      {
        recordId && record && (
          <ButtonFieldItem record={record} recordId={recordId} field={field} />
        )
      }
    </>
  );
};

export const ButtonEditor = memo(forwardRef(ButtonEditorBase));
