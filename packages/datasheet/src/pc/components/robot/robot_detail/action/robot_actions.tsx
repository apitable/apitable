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

import { useSetAtom, useAtomValue } from 'jotai';
import React, { useEffect, useMemo } from 'react';
import { Box } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { automationActionsAtom, automationStateAtom, inheritedTriggerAtom } from '../../../automation/controller';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { OrTooltip } from '../../../common/or_tooltip';
import { getNodeOutputSchemaList } from '../../helper';
import { useActionTypes } from '../../hooks';
import { ITriggerType } from '../../interface';
import { EditType } from '../trigger/robot_trigger';
import { getActionList } from '../utils';
import { LinkButton } from './link';
import { RobotAction } from './robot_action';
import {
  CONST_MAX_ACTION_COUNT,
  CreateNewAction,
  CreateNewActionLineButton,
} from './robot_action_create';

export const RobotActions = ({
  robotId,
  triggerTypes,
  onScrollBottom = () => {},
}: {
  robotId: string;
  triggerTypes: ITriggerType[];
  onScrollBottom?: () => void;
}) => {
  const { data: actionTypes } = useActionTypes();
  const robot = useAtomValue(automationStateAtom);
  const permissions = useAutomationResourcePermission();
  const actions = (robot?.robot?.actions ?? []).map(action => ({ ...action,
    typeId: action.actionTypeId,
    id: action.actionId }));

  const setActions = useSetAtom(automationActionsAtom);
  useEffect(( ) => {
    if(actions) {
      setActions(actions);
    }
  }, [actions, setActions]);
  const entryActionId = actions?.find((item: any) => item.prevActionId == '' || item.prevActionId == null )?.actionId;

  const actionList = useMemo(() => getActionList(actions), [actions]);

  const trigger = useAtomValue(inheritedTriggerAtom);

  const nodeOutputSchemaList = getNodeOutputSchemaList({
    actionList,
    actionTypes,
    triggerTypes,
    trigger: trigger,
  });

  if (!entryActionId) {
    return (
      <CreateNewAction robotId={robotId} actionTypes={actionTypes} disabled={trigger==null} nodeOutputSchemaList={nodeOutputSchemaList}/>
    );
  }

  return (
    <Box width="100%">
      {actionList.map((action, index) => (
        <Box key={`${index}_${actionList[index - 1]?.prevActionId}_${action.id}`}>
          {index > 0 && index < actionList.length && (
            <CreateNewActionLineButton
              disabled={actionList?.length >= CONST_MAX_ACTION_COUNT || !permissions.editable}
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
                  <LinkButton disabled={actionList?.length >= CONST_MAX_ACTION_COUNT
                      || !permissions.editable
                  } />
                </OrTooltip>
              </span>
            </CreateNewActionLineButton>
          )}
          <RobotAction
            editType={EditType.entry}
            index={index + 1}
            action={action}
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
          disabled={actionList?.length >= CONST_MAX_ACTION_COUNT ||
              !permissions?.editable
          }
          robotId={robotId}
          actionTypes={actionTypes}
          prevActionId={actionList[actionList.length - 1]?.id}
        />
      </OrTooltip>

    </Box >
  );
};
