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

import { useAtomValue, useAtom } from 'jotai';
import { cloneElement, FC, ReactElement, ReactNode } from 'react';
import { mutate } from 'swr';
import {
  Box,
  ContextMenu,
  useContextMenu,
  SearchSelect,
} from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { flatContextData } from 'pc/utils';
import { automationPanelAtom, automationStateAtom, PanelName } from '../../../automation/controller';
import { createAction } from '../../api';
import { IActionType, INodeOutputSchema } from '../../interface';
import { useRobotListState } from '../../robot_list';
import { NewItem } from '../../robot_list/new_item';
import { EditType } from '../trigger/robot_trigger';
import itemStyle from '../trigger/select_styles.module.less';

export const CONST_MAX_ACTION_COUNT = 9;

export const CreateNewAction = ({ robotId, actionTypes, prevActionId, disabled = false, nodeOutputSchemaList }: {
  robotId: string;
  disabled?:boolean;
  actionTypes: IActionType[];
  nodeOutputSchemaList: INodeOutputSchema[];
  prevActionId?: string;
}) => {

  const [, setAutomationPanel] = useAtom(automationPanelAtom);
  const automationState= useAtomValue(automationStateAtom);
  const { api: { refresh }} = useRobotListState();
  const createNewAction = async(action: {
    actionTypeId: string;
    robotId: string;
    prevActionId?: string;
    input?: any;
  }) => {
    const res = await createAction(action);
    mutate(`/automation/robots/${robotId}/actions`);

    if(!automationState?.resourceId) {
      return;
    }
    await refresh({
      resourceId: automationState?.resourceId!,
      robotId: robotId,
    });

    const data = res.data.data;
    setAutomationPanel({
      panelName: PanelName.Action,
      dataId: data.actionId,
      data: {
        // @ts-ignore
        robotId: action.robotId,
        editType: EditType.detail,
        nodeOutputSchemaList: nodeOutputSchemaList,
        action:  { ...data, typeId: data.actionTypeId },
      }
    }
    );
    return res.data;
  };

  return (
    <SearchSelect
      clazz={{
        item: itemStyle.item,
        icon: itemStyle.icon
      }}
      disabled={disabled}
      options={{
        placeholder: t(Strings.search_field),
        noDataText: t(Strings.empty_data),
        minWidth: '384px',
      }}
      list={actionTypes.map(item => ({
        label: item.name,
        value: item.actionTypeId,
        prefixIcon: <img src={integrateCdnHost(item.service.logo)} width={20} alt={''} style={{ marginRight: 4 }} />
      }))} onChange={(item) => {
        createNewAction({
          robotId,
          actionTypeId: String(item.value),
          prevActionId
        });
      }}>

      <NewItem disabled={disabled} >
        {t(Strings.robot_new_action)}
      </NewItem>
    </SearchSelect>);
};

export const CreateNewActionLineButton = ({ robotId, actionTypes, prevActionId, disabled = false, children, nodeOutputSchemaList }: {
  robotId: string;
  children: ReactElement;
  disabled?:boolean;
  nodeOutputSchemaList: INodeOutputSchema[];
  actionTypes: IActionType[];
  prevActionId?: string;
}) => {

  const automationState= useAtomValue(automationStateAtom);
  const [, setAutomationPanel] = useAtom(automationPanelAtom);
  const { api: { refresh }} = useRobotListState();

  const createNewAction = async(action: {
    actionTypeId: string;
    robotId: string;
    prevActionId?: string;
    input?: any;
  }) => {

    const res = await createAction(action);
    mutate(`/automation/robots/${robotId}/actions`);

    if(!automationState?.resourceId) {
      return;
    }
    await refresh({
      resourceId: automationState?.resourceId!,
      robotId: robotId,
    });

    const actionId = res.data.data.actionId;
    const data = res.data.data;

    setAutomationPanel({
      panelName: PanelName.Action,
      dataId: actionId,
      data: {
        // @ts-ignore
        robotId: action.robotId,
        editType: EditType.detail,
        nodeOutputSchemaList: nodeOutputSchemaList,
        action:  { ...data, typeId: data.actionTypeId },
      }
    }
    );

    return res.data;

  };

  return (
    <SearchSelect
      disabled={disabled}
      clazz={{
        item: itemStyle.item,
        icon: itemStyle.icon
      }}
      options={{
        placeholder: t(Strings.search_field),
        noDataText: t(Strings.empty_data),
        minWidth: '384px',
      }}
      list={actionTypes.map(item => ({
        label: item.name,
        value: item.actionTypeId,
        prefixIcon: <img src={integrateCdnHost(item.service.logo)} width={20} alt={''} style={{ marginRight: 4 }} />
      }))} onChange={(item) => {
        createNewAction({
          robotId,
          actionTypeId: String(item.value),
          prevActionId
        });
      }}>
      {
        children
      }
    </SearchSelect>);
};
