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

import { useAtomValue } from 'jotai';
import * as React from 'react';
import { memo, useEffect } from 'react';
import { Skeleton } from '@apitable/components';
import { ConfigConstant, Selectors, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { automationDrawerVisibleAtom } from '../../automation/controller';
import { useAutomationNavigateController } from '../../automation/controller/controller';
import { useAutomationList } from '../../automation/controller/use_robot_list';
import { OrTooltip } from '../../common/or_tooltip';
import { useActionTypes, useAddNewRobot, useTriggerTypes } from '../hooks';
import { RobotListItemCard } from '../robot_list_item';
import { NewItem } from './new_item';
import { RobotEmptyList } from './robot_empty_list';

export const RobotList = memo(() => {
  const permissions = useAppSelector(Selectors.getPermissions);
  const canManageRobot = permissions.manageable;

  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);
  const { state: { error, data: robotList }, api: { refresh } } = useAutomationList();

  const { data: triggerTypes, loading: triggerTypesLoading } = useTriggerTypes();
  const { data: actionTypes, loading: actionTypesLoading } = useActionTypes();

  const { createNewRobot, navigateAutomation } = useAutomationNavigateController();

  const showModal = useAtomValue(automationDrawerVisibleAtom);

  useEffect(() => {
    if (!showModal) {
      refresh();
    }
  }, [refresh, showModal]);

  const {
    canAddNewRobot,
    disableTip,
  } = useAddNewRobot();

  if (error) return null;
  if (triggerTypesLoading || actionTypesLoading || triggerTypes.length === 0 || actionTypes.length === 0) {
    return <Skeleton
      count={3}
      height="68px"
      type="text"
      circle={false}
      style={{
        marginBottom: 16,
      }}
    />;
  }

  if (robotList?.length === 0) {
    return <RobotEmptyList />;
  }

  const robotLength = robotList?.length ??0;
  return (
    <div style={{ width: '100%' }} >
      {
        robotList?.map((robot, index) => {
          return (
            <RobotListItemCard
              index={index}
              key={robot.robotId}
              robotCardInfo={robot}
              onNavigate={async () => {
                await navigateAutomation(robot.resourceId, robot.robotId);
              }}
              readonly={!canManageRobot}
            />
          );
        })
      }
      <OrTooltip tooltip={disableTip} tooltipEnable={robotLength >= ConfigConstant.MAX_ROBOT_COUNT_PER_DST} >
        <NewItem
          height={64}
          disabled={(!canAddNewRobot) || Boolean(robotLength >= ConfigConstant.MAX_ROBOT_COUNT_PER_DST)}
          onClick={async () => {
            if(!canManageRobot) {
              return;
            }

            await createNewRobot(datasheetId);
            await refresh();
          }}
        >
          {
            t(Strings.new_automation)
          }
        </NewItem>
      </OrTooltip>
    </div>
  );
});
