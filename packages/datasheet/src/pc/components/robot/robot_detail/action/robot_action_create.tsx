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
import { ReactElement, useCallback, useMemo } from 'react';
import {
  SearchSelect,
} from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { getActionList } from 'pc/components/robot/robot_detail/utils';
import { useAutomationController } from '../../../automation/controller';
import { automationPanelAtom, automationStateAtom, PanelName } from '../../../automation/controller/atoms';
import { createAction } from '../../api';
import { IActionType, INodeOutputSchema, IRobotAction } from '../../interface';
import { NewItem } from '../../robot_list/new_item';
import { EditType } from '../trigger/robot_trigger';
import itemStyle from '../trigger/select_styles.module.less';
import { debounce } from 'lodash';

export const getNextAction = (actionList: IRobotAction[], preActionId ?: string) => {
  const actionIndex = actionList.findIndex(action => action.actionId === preActionId);
  const r = actionList[actionIndex + 1];
  return r;
};
export const CreateNewAction = ({ robotId, actionTypes, prevActionId, disabled = false, nodeOutputSchemaList }: {
  robotId: string;
  disabled?:boolean;
  actionTypes: IActionType[];
  nodeOutputSchemaList: INodeOutputSchema[];
  prevActionId?: string;
}) => {

  const [, setAutomationPanel] = useAtom(automationPanelAtom);
  const automationState= useAtomValue(automationStateAtom);
  const { api: { refresh } } = useAutomationController();
  const createNewAction = useCallback(async (action: {
    actionTypeId: string;
    robotId: string;
    prevActionId?: string;
    input?: any;
  }) => {
    if(!automationState?.resourceId) {
      console.error('resourceId is empty');
      return;
    }
    const res = await createAction(automationState.resourceId, action);
    if(!automationState?.resourceId) {
      return;
    }
    await refresh({
      resourceId: automationState?.resourceId!,
      robotId: robotId,
    });

    const data = getNextAction(getActionList(res.data.data), prevActionId);

    if(data) {
      setAutomationPanel({
        panelName: PanelName.Action,
        dataId: data.actionId,
        data: {
          // @ts-ignore
          robotId: action.robotId,
          editType: EditType.detail,
          nodeOutputSchemaList: nodeOutputSchemaList,
          action: { ...data, id: data.actionId, typeId: data.actionTypeId },
        }
      }
      );
    }else {

      setAutomationPanel({
        panelName: PanelName.BasicInfo,
        dataId: undefined,
        data: undefined
      });
    }
    return res.data;
  }, [automationState?.resourceId, nodeOutputSchemaList, prevActionId, refresh, robotId, setAutomationPanel]);

  const debouncedCreateAction = debounce(createNewAction, 1000);

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
      debouncedCreateAction({
          robotId,
          actionTypeId: String(item.value),
          prevActionId
        });
      }}>

      <NewItem disabled={disabled} itemId={'CONST_ROBOT_ACTION_CREATE'}>
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
  const { api: { refresh } } = useAutomationController();

  const createNewAction = async (action: {
    actionTypeId: string;
    robotId: string;
    prevActionId?: string;
    input?: any;
  }) => {

    if(!automationState?.resourceId) {
      console.error('resourceId is empty');
      return;
    }
    const res = await createAction(automationState.resourceId, action);

    if(!automationState?.resourceId) {
      return;
    }
    await refresh({
      resourceId: automationState?.resourceId!,
      robotId: robotId,
    });

    const newAction = getNextAction(getActionList(res.data.data), prevActionId);

    if(newAction) {
      setAutomationPanel({
        panelName: PanelName.Action,
        dataId: newAction.actionId,
        data: {
          // @ts-ignore
          robotId: action.robotId,
          editType: EditType.detail,
          nodeOutputSchemaList: nodeOutputSchemaList,
          action:  { ...newAction, id: newAction.actionId, typeId: newAction.actionTypeId },
        }
      });
    }else {
      setAutomationPanel({
        panelName: PanelName.BasicInfo,
        dataId: undefined,
        data: undefined
      });
    }

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
