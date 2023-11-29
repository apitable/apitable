import { message } from 'antd';
import * as React from 'react';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { Box } from '@apitable/components';
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

export interface IRunRespStatus {
 success:boolean, message: string
}

const timeout = (prom: any, time: number, exception: any) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time, exception))
  ]).finally(() => clearTimeout(timer));
};

export const runAutomationButton = async (datasheetId: string, record: any, state: IReduxState, recordId: string, fieldId: string, field: IButtonField,
  callback: () => void
) : Promise<any|undefined>=> {
  if(field.property.action.type === ButtonActionType.OpenLink) {

    try {
      if(field.property.action.openLink?.type === OpenLinkType.Url ) {
        window.open(field.property.action.openLink?.expression, '_blank');
      }else {
        const expression = field.property.action.openLink?.expression ?? '';

        const url = evaluate(expression, { field, record, state }, false);

        window.open(String(url), '_blank');

      }
    } catch (e){
      console.log('error', e);
      callback();
    }

    callback();
    return;
  }

  // TODO width poll call function

  try {
    const respTrigger = await timeout(reqDatasheetButtonTrigger({
      dstId: datasheetId,
      recordId,
      fieldId,
    }), 60 * 1000, { data : { success: false, message: t(Strings.task_timeout) } });
    const respData = respTrigger?.data as IRunRespStatus;
    // TODO status run status
    if(!respData?.success) {
      message.error(
        t(Strings.button_execute_error, {
          ERROR_MESSAGE: respData?.message
        })
      );
    }
    callback();
    return respTrigger;
  } catch (e) {
    callback();
    return undefined;
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
    <Box width={props.width} display={'flex'} justifyContent={'center'} height={'26px'} paddingTop={'4px'}>
      {
        recordId && record && (
          <ButtonFieldItem record={record} recordId={recordId} field={field} maxWidth={'calc(100% - 40px)'}/>
        )
      }
    </Box>
  );
};

export const ButtonEditor = memo(forwardRef(ButtonEditorBase));
