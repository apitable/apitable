/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

export const runAutomationUrl = (datasheetId: string, record: any, state: IReduxState, recordId: string, fieldId: string, field: IButtonField,
) => {
  if (field.property.action.type === ButtonActionType.OpenLink) {

    try {
      if (field.property.action.openLink?.type === OpenLinkType.Url) {
        window.open(field.property.action.openLink?.expression, '_blank');
      } else {
        const expression = field.property.action.openLink?.expression ?? '';

        const url = evaluate(expression, { field, record, state }, false);

        window.open(String(url), '_blank');

      }
    } catch (e) {
      console.log('error', e);
    }
  }
};

export const runAutomationButton = async (datasheetId: string, record: any, state: IReduxState, recordId: string, fieldId: string, field: IButtonField,
  callback: (success?: boolean) => void
) : Promise<any|undefined>=> {
  if(field.property.action.type === ButtonActionType.OpenLink) {
    return;
  }
  try {
    const respTrigger = await timeout(reqDatasheetButtonTrigger({
      dstId: datasheetId,
      recordId,
      fieldId,
    }), 10 * 1000, { data : { success: false, message: t(Strings.task_timeout) } });
    const respData = respTrigger?.data as IRunRespStatus;
    const success = respData?.success ?? false;
    console.log(`runAutomationButton  recordId ${recordId}`);
    callback(success);
    return respTrigger;
  } catch (e) {
    callback(false);
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
