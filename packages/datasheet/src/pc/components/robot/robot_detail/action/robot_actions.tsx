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

import { Box } from '@apitable/components';
import { useDebounceFn } from 'ahooks';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getFilterActionTypes, getNodeOutputSchemaList } from '../../helper';
import { IActionType, IRobotAction, IRobotTrigger, ITriggerType } from '../../interface';
import { RobotAction } from './robot_action';
import { CreateNewAction, CONST_MAX_ACTION_COUNT } from './robot_action_create';

const req = axios.create({
  baseURL: '/nest/v1/',
});

export const RobotActions = ({ robotId, triggerTypes, actionTypes, trigger, onScrollBottom }:
  {
    robotId: string;
    trigger?: IRobotTrigger;
    triggerTypes: ITriggerType[];
    actionTypes: IActionType[];
    onScrollBottom: () => void;
  }
) => {
  const { run } = useDebounceFn(onScrollBottom, { wait: 100 });

  const filterActionTypes = useMemo(() => {
    return getFilterActionTypes(actionTypes);
  }, [actionTypes]);

  const { data, error } = useSWR(`/robots/${robotId}/actions`, req);
  if (!data || error) {
    return null;
  }
  const actions = data.data.data;

  const entryActionId = actions.find((item: any) => item.prevActionId === null)?.id;
  if (!entryActionId) {
    return <CreateNewAction robotId={robotId} actionTypes={filterActionTypes} />;
  }
  const actionsById = actions.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {});
  // prev => next
  Object.keys(actionsById).forEach(item => {
    const action = actionsById[item];
    if (action.prevActionId) {
      actionsById[action.prevActionId].nextActionId = action.id;
    }
  });
  const actionList: IRobotAction[] = [actionsById[entryActionId]];
  Object.keys(actionsById).forEach(item => {
    const action = actionsById[item];
    if (action.nextActionId) {
      actionList.push(actionsById[action.nextActionId]);
    }
  });

  run();

  const nodeOutputSchemaList = getNodeOutputSchemaList({
    actionList,
    actionTypes,
    triggerTypes,
    trigger,
  });

  // Guides the creation of a trigger when there is no trigger
  // <NodeForm schema={triggerUpdateForm as any} onSubmit={handleUpdateFormChange} />
  return (
    <Box
      width='100%'
      marginTop="24px"
    >
      {
        actionList.map((action, index) => <RobotAction
          index={index}
          key={index}
          action={action}
          actionTypes={actionTypes}
          nodeOutputSchemaList={nodeOutputSchemaList}
          robotId={robotId}
        />)
      }
      <CreateNewAction
        disabled={CONST_MAX_ACTION_COUNT}
        robotId={robotId}
        actionTypes={filterActionTypes}
        prevActionId={actionList[actionList.length - 1].id}
      />
    </Box >
  );
};
