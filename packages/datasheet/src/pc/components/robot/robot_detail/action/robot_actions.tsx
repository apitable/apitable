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

import { useDebounceFn } from 'ahooks';
import axios from 'axios';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Box } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { getNodeOutputSchemaList } from '../../helper';
import { useActionTypes } from '../../hooks';
import { IRobotAction, IRobotTrigger, ITriggerType } from '../../interface';
import { OrTooltip } from '../or_tooltip';
import { EditType } from '../trigger/robot_trigger';
import { LinkButton } from './link';
import { RobotAction } from './robot_action';
import {
  CONST_MAX_ACTION_COUNT,
  CreateNewAction,
  CreateNewActionLineButton,
} from './robot_action_create';

const req = axios.create({
  baseURL: '/nest/v1/',
});


export const getActionList = (actions?: []): IRobotAction[] => {
  if (!actions || actions.length === 0) {
    return [];
  }

  const preActionIdMap:Record<string, IRobotAction> = actions.map((action: IRobotAction) => ({
    [action.prevActionId]:  action,
  })).reduce((acc: any, item: any) => ({ ...acc, ...item }), {});

  const headOpt: IRobotAction|undefined = actions.find((item: IRobotAction) => item.prevActionId == null || item.prevActionId =='');
  if(!headOpt) {
    return [];
  }
  const head : IRobotAction= headOpt!;
  const findNextAction = (count: number, current : string, resultList: IRobotAction[]): IRobotAction[] => {
    if(count === 0 ) {
      return resultList;
    }
    const action = preActionIdMap[current];
    return findNextAction(count -1, action.id, resultList.concat(action!));
  };

  return findNextAction(actions.length - 1, head.id, [head]);
};

export const RobotActions = ({
  robotId,
  triggerTypes,
  trigger,
  onScrollBottom = () => {},
}: {
  robotId: string;
  trigger?: IRobotTrigger;
  triggerTypes: ITriggerType[];
  onScrollBottom?: () => void;
}) => {
  const { data: actionTypes } = useActionTypes();
  const { run } = useDebounceFn(onScrollBottom, { wait: 100 });

  const { data, error } = useSWR(`/automation/robots/${robotId}/actions`, req);
  const actions = data?.data?.data;

  const entryActionId = actions?.find((item: any) => item.prevActionId === null)?.id;

  const actionList = useMemo(() => getActionList(actions), [actions]);


  const nodeOutputSchemaList = getNodeOutputSchemaList({
    actionList,
    actionTypes,
    triggerTypes,
    trigger,
  });

  if (!data || error) {
    return null;
  }
  if (!entryActionId) {
    return (
      <CreateNewAction robotId={robotId} actionTypes={actionTypes} disabled={trigger==null} nodeOutputSchemaList={nodeOutputSchemaList}/>
    );
  }

  run();

  // Guides the creation of a trigger when there is no trigger
  // <NodeForm schema={triggerUpdateForm as any} onSubmit={handleUpdateFormChange} />
  return (
    <Box width="100%">
      {actionList.map((action, index) => (
        <Box key={`${index}_${actionList[index - 1]?.prevActionId}_${action.id}`}>
          {index > 0 && index < actionList.length && (
            <CreateNewActionLineButton
              disabled={actionList?.length >= CONST_MAX_ACTION_COUNT}
              robotId={robotId}
              actionTypes={actionTypes}
              nodeOutputSchemaList={nodeOutputSchemaList}
              prevActionId={actionList[index - 1].id}
            >
              <span>
                <OrTooltip
                  options={{
                    offset: -10,
                  }}
                  tooltipEnable={actionList?.length >= CONST_MAX_ACTION_COUNT}
                  tooltip={t(Strings.automation_action_num_warning, {
                    value: CONST_MAX_ACTION_COUNT,
                  })}
                  placement={'top'}
                >
                  <LinkButton disabled={actionList?.length >= CONST_MAX_ACTION_COUNT} />
                </OrTooltip>
              </span>
            </CreateNewActionLineButton>
          )}
          <RobotAction
            editType={EditType.entry}
            index={index + 1}
            action={action}
            nodeOutputSchemaList={nodeOutputSchemaList}
            robotId={robotId}
          />
        </Box>
      ))}

      <OrTooltip
        tooltipEnable={
          actionList?.length >= CONST_MAX_ACTION_COUNT
        }
        tooltip={t(Strings.automation_action_num_warning, {
          value: CONST_MAX_ACTION_COUNT,
        })} placement={'top'}>
        <CreateNewAction
          nodeOutputSchemaList={nodeOutputSchemaList}
          disabled={actionList?.length >= CONST_MAX_ACTION_COUNT}
          robotId={robotId}
          actionTypes={actionTypes}
          prevActionId={actionList[actionList.length - 1].id}
        />
      </OrTooltip>

    </Box >
  );
};
