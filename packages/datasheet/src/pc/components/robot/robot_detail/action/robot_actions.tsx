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
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { Box } from '@apitable/components';
import { IReduxState, Selectors, Strings, t } from '@apitable/core';
import { IFetchDatasheet } from '@apitable/widget-sdk/dist/message/interface';
import { CONST_MAX_ACTION_COUNT } from 'pc/components/automation/config';
import { getTriggerDatasheetId, IFetchedDatasheet } from 'pc/components/automation/controller/hooks/use_robot_fields';
import { OrEmpty } from 'pc/components/common/or_empty';
import { useAppSelector } from 'pc/store/react-redux';
import { automationActionsAtom, automationStateAtom } from '../../../automation/controller';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { OrTooltip } from '../../../common/or_tooltip';
import { getNodeOutputSchemaList } from '../../helper';
import { useActionTypes } from '../../hooks';
import { AutomationScenario, ITriggerType } from '../../interface';
import { EditType } from '../trigger/robot_trigger';
import { getActionList, getTriggerList } from '../utils';
import { LinkButton } from './link';
import { RobotAction } from './robot_action';
import { CreateNewAction, CreateNewActionLineButton } from './robot_action_create';

export const RobotActions = ({ robotId, triggerTypes }: { robotId: string; triggerTypes: ITriggerType[]; onScrollBottom?: () => void }) => {
  const { data: actionTypes } = useActionTypes();
  const robot = useAtomValue(automationStateAtom);
  const permissions = useAutomationResourcePermission();
  const actions = (robot?.robot?.actions ?? []).map((action) => ({ ...action, typeId: action.actionTypeId, id: action.actionId }));

  const setActions = useSetAtom(automationActionsAtom);
  useEffect(() => {
    if (actions) {
      setActions(actions);
    }
  }, [actions, setActions]);
  const entryActionId = actions?.find((item: any) => item.prevActionId == '' || item.prevActionId == null)?.actionId;

  const actionList = useMemo(() => getActionList(actions), [actions]);

  const triggers = getTriggerList(robot?.robot?.triggers ?? []);
  const { data: dataList1 } = useSWR(['getRobotMagicDatasheet', triggers], () => getTriggerDatasheetId(triggers), {});
  const activeDstId = useAppSelector(Selectors.getActiveDatasheetId);

  const dataSheetMap = useAppSelector((state: IReduxState) => state.datasheetMap);

  const triggerDataSheetIds: IFetchedDatasheet[] =
    robot?.scenario === AutomationScenario?.datasheet
      ? Array.from({ length: triggers.length }, () => activeDstId)
      : ((dataList1 ?? []) as IFetchedDatasheet[]);

  const triggerDataSheetMap : Record<string, string> = triggers.map((trigger, index) => ({ trigger, index })).reduce((p, c) => {
    return {
      ...p,
      [c.trigger.triggerId]: triggerDataSheetIds[c.index]
    };
  }, {});

  const nodeOutputSchemaList = getNodeOutputSchemaList({
    actionList,
    actionTypes,
    triggerTypes,
    triggers,
    triggerDataSheetMap,
    dataSheetMap,
  });

  if (!entryActionId) {
    return (
      <CreateNewAction
        robotId={robotId}
        actionTypes={actionTypes}
        disabled={triggers.length == 0 || !permissions?.editable}
        nodeOutputSchemaList={nodeOutputSchemaList}
      />
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
                  <LinkButton disabled={actionList?.length >= CONST_MAX_ACTION_COUNT || !permissions.editable} />
                </OrTooltip>
              </span>
            </CreateNewActionLineButton>
          )}
          <RobotAction editType={EditType.entry} index={index + 1} action={action} robotId={robotId} />
        </Box>
      ))}

      <OrEmpty visible={permissions?.editable}>
        <OrTooltip
          tooltipEnable={actionList?.length >= CONST_MAX_ACTION_COUNT}
          tooltip={t(Strings.automation_action_num_warning, {
            value: CONST_MAX_ACTION_COUNT,
          })}
          placement={'top'}
        >
          <CreateNewAction
            nodeOutputSchemaList={nodeOutputSchemaList}
            disabled={actionList?.length >= CONST_MAX_ACTION_COUNT || !permissions?.editable}
            robotId={robotId}
            actionTypes={actionTypes}
            prevActionId={actionList[actionList.length - 1]?.id}
          />
        </OrTooltip>
      </OrEmpty>
    </Box>
  );
};
