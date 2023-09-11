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

import { useAtom } from 'jotai';
import { memo, useMemo } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useSWR from 'swr';
import { Box, Skeleton } from '@apitable/components';
import { Api, ConfigConstant, Selectors, Strings, t } from '@apitable/core';
import { automationStateAtom } from '../../automation/controller';
import { getResourceAutomationDetail, getResourceAutomations } from '../api';
import {
  useActionTypes,
  useAddNewRobot, useRobot,
  useTriggerTypes
} from '../hooks';
import { RobotListItemCard } from '../robot_list_item';
import { useRobotController } from './controller';
import { NewItem } from './new_item';
import { RobotEmptyList } from './robot_empty_list';

export const CONST_MAX_ROBOT_COUNT = 9;

export const StyledBox = styled(Box)`
  &:hover {
    background-color: var(--bgControlsHover);
    
    border-color: var(--borderBrandActive);
  }
`;

export const useRobotListState = () => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const { data: automationList, error, mutate: mutateRefresh }
      = useSWR(`getResourceAutomations-${datasheetId}`, () => getResourceAutomations(datasheetId!));

  const { data: formList } = useSWR(`${Api.getRelateNodeByDstId}_${datasheetId}`, () =>
    Api.getRelateNodeByDstId(datasheetId!, undefined, ConfigConstant.NodeType.FORM));

  const [state, setAutomationAtom] = useAtom(automationStateAtom );

  const currentRobotId = state?.currentRobotId;

  const getById = (robotId: string) => {
    return automationList?.find(item => item.robotId === robotId);
  };
  return useMemo(() => (
    {
      state: {
        formList: formList?.data?.data ?? [],
        data: automationList,
        error
      },
      api: {
        getById,
        refreshItem  : async(
        ) => {
          await mutateRefresh();
          if (state?.resourceId && state?.currentRobotId) {
            const itemDetail = await getResourceAutomationDetail(state?.resourceId, state?.currentRobotId);
            const newState = {
              robot: itemDetail,
              currentRobotId: currentRobotId,
              resourceId: state.resourceId,
            };
            setAutomationAtom(newState);
          }
        },
        refresh  : async(
          data?: {
              resourceId: string;
              robotId: string;
            }
        ) => {
          await mutateRefresh();
          if(!state?.resourceId || !state?.currentRobotId) {
            return;
          }
          if(data?.resourceId && data?.robotId) {
            const itemDetail = await getResourceAutomationDetail(data?.resourceId, data?.robotId);
            const newState = {
              robot: itemDetail,
              currentRobotId:  currentRobotId,
              resourceId:state.resourceId,
            };
            setAutomationAtom(newState);
          }
        }
      }
    }
  ), [formList?.data?.data, automationList, error, getById, state?.resourceId, state?.currentRobotId, currentRobotId, setAutomationAtom, mutateRefresh]);

};

export const RobotList = memo(() => {
  const permissions = useSelector(Selectors.getPermissions);
  const canManageRobot = permissions.manageable;

  const { state: { data: robotList }} = useRobotListState();

  const { state: { error }, api: { refresh }} = useRobotListState();

  const { data: triggerTypes, loading: triggerTypesLoading } = useTriggerTypes();
  const { data: actionTypes, loading: actionTypesLoading } = useActionTypes();

  const { createNewRobot, navigateAutomation } = useRobotController();

  const { canAddNewRobot } = useAddNewRobot();

  const robot = useRobot();
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
              onNavigate={async() => {
                await navigateAutomation(robot.resourceId, robot.robotId);
              }}
              readonly={!canManageRobot}
            />
          );
        })
      }
      <NewItem
        height={64}
        disabled={(!canAddNewRobot) || Boolean(robotLength > ConfigConstant.MAX_ROBOT_COUNT_PER_DST)}
        onClick={async() => {
          if(!canManageRobot) {
            return;
          }

          await createNewRobot();
          await refresh();
        }}
      >
        {
          t(Strings.new_automation)
        }
      </NewItem>
    </div>
  );
});
