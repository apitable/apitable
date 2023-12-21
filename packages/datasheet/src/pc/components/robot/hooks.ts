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

import { useLocalStorageState } from 'ahooks';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { isNil } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { ConfigConstant, IReduxState, isPrivateDeployment, Selectors, Strings, SystemConfig, t } from '@apitable/core';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { Message } from 'pc/components/common';
import { useActionTypes, useTriggerTypes } from 'pc/components/robot/robot_panel/hook_trigger';
import { getAllColumnsFp, useAllColumns } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { automationStateAtom, useAutomationController } from '../automation/controller';
import { useAutomationList } from '../automation/controller/use_robot_list';
import { activeRobot, deActiveRobot, deleteRobotAction } from './api';
import { INodeType, ITriggerType } from './interface';
import { IAutomationRobotDetailItem } from './robot_context';
import { getFields } from './robot_detail/trigger/helper';
import { getActionList, getTriggerList } from './robot_detail/utils';

export const nestReq = axios.create({
  baseURL: '/nest/v1/',
});

export const getAllFieldsByDstIdFp = (state: IReduxState, datasheetId?: string) => {
  if (!datasheetId) {
    return [];
  }
  const columns = getAllColumnsFp(state, datasheetId, true);
  const snapshot = Selectors.getSnapshot(state, datasheetId);
  const fieldMap = snapshot?.meta?.fieldMap;
  if (!fieldMap || !columns) return [];
  const fields = getFields(columns, fieldMap);
  return fields;
};

export const useAllFieldsByDstId = (datasheetId: string) => {
  const columns = useAllColumns(datasheetId, true);
  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, datasheetId);
  });

  return useMemo(() => {
    const fieldMap = snapshot?.meta?.fieldMap;
    if (!fieldMap || !columns) return [];
    const fields = getFields(columns, fieldMap);
    return fields;
  }, [columns, snapshot?.meta?.fieldMap]);
};

export const useAllFields = () => {
  const value = useAtomValue(automationStateAtom);
  const datasheetId = value?.resourceId ?? '';
  const columns = useAllColumns(datasheetId, true);
  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, datasheetId);
  });

  return useMemo(() => {
    const fieldMap = snapshot?.meta?.fieldMap;
    if (!fieldMap || !columns) return [];
    const fields = getFields(columns, fieldMap);
    return fields;
  }, [columns, snapshot?.meta?.fieldMap]);
};

export const useAddNewRobot = () => {
  const permissions = useAppSelector(Selectors.getPermissions);
  const {
    state: { data: robotList },
  } = useAutomationList();
  const canAddNewRobot = permissions.manageable && robotList && robotList.length < ConfigConstant.MAX_ROBOT_COUNT_PER_DST;
  const disableTip = permissions.manageable ? t(Strings.robot_reach_count_limit) : t(Strings.robot_share_page_create_tip);
  return {
    canAddNewRobot,
    disableTip,
  };
};

export const useDeleteRobotAction = () => {
  const [state] = useAtom(automationStateAtom);
  const currentRobotId = state?.currentRobotId;
  return useCallback(
    (actionId: string) => {
      if (currentRobotId && state?.resourceId && state?.robot?.robotId) {
        return deleteRobotAction(state?.resourceId, actionId, state.robot?.robotId);
      }
      return false;
    },
    [currentRobotId, state?.resourceId, state?.robot?.robotId],
  );
};

export const useToggleRobotActive = (resourceId: string, robotId: string) => {
  const [loading, setLoading] = useState(false);
  const automationState = useAtomValue(automationStateAtom);

  const [isNotifed, setIsNotified] = useLocalStorageState<string>('AutomationButtonTip');

  const {
    api: { refreshItem },
  } = useAutomationController();
  const toggleRobotActive = useCallback(
    async (isActive: boolean) => {
      if (isActive) {
        setLoading(true);
        const ok = await deActiveRobot(robotId);

        setLoading(false);
        if (ok) {
          await refreshItem();
        }
      } else {
        setLoading(true);
        const ok = await activeRobot(robotId);
        setLoading(false);
        if (ok) {
          await refreshItem();
          const item = automationState?.robot?.triggers?.find((item) => getFieldId(item) != null);
          if (item != null && isNotifed == null && !isActive) {
            Message.success({
              content: t(Strings.automation_enabled_return_via_related_files),
            });
            setIsNotified(String(true));
            return;
          }

          Message.success({
            content: t(Strings.automation_enabled),
          });
        } else {
          Message.error({
            content: t(Strings.robot_enable_config_incomplete_error),
          });
        }
      }
    },
    [robotId, refreshItem],
  );

  return {
    toggleRobotActive,
    loading,
  };
};

export const useRobotTriggerTypes = (): ITriggerType[] => {
  const { data: triggerTypes } = useTriggerTypes();

  const [state] = useAtom(automationStateAtom);

  const triggerTypeList = useMemo(() => {
    if (!state?.robot) {
      return null;
    }
    if (state?.robot) {
      const data = state?.robot;
      if (!data) {
        return [];
      }
      // eslint-disable-next-line max-len
      return getTriggerList(data.triggers)
        .map((action) => triggerTypes?.find((trigger) => trigger.triggerTypeId === action.triggerTypeId))
        .filter(Boolean);
    }

    return [];
  }, [triggerTypes, state]);
  return triggerTypeList as ITriggerType[];
};

export const useRobotActionTypes = () => {
  const [state] = useAtom(automationStateAtom);
  const { data: actionTypes } = useActionTypes();

  return useMemo(() => {
    if (!state?.robot) {
      return null;
    }
    const robot = state?.robot;
    // @ts-ignore
    return getActionList(
      robot.actions.map((item) => ({
        ...item,
        id: item.actionId,
      })),
    ).map((action) => actionTypes?.find((actionType) => actionType.actionTypeId === action.actionTypeId));
  }, [actionTypes, state]);
};

export const useAutomationRobot = () => {
  const [state, setState] = useAtom(automationStateAtom);
  const currentRobotId = state?.currentRobotId;

  return {
    resourceId: state?.resourceId,
    currentRobotId,
    robot: state?.robot,
    reset: () => {
      setState((state) => ({
        ...state,
        robot: undefined,
        currentRobotId: undefined,
      }));
    },
    updateRobot: (data: Partial<IAutomationRobotDetailItem>) => {
      if (!state?.robot) {
        return;
      }
      setState({ ...state, robot: { ...state.robot, ...data } });
    },
  };
};

export const useNodeTypeByIds = () => {
  const { data: actionTypes } = useActionTypes();
  const { data: triggerTypes } = useTriggerTypes();
  return useMemo(() => {
    const nodeTypeByIds: {
      [nodeTypeId: string]: INodeType;
    } = {};
    triggerTypes.forEach((triggerType) => {
      nodeTypeByIds[triggerType.triggerTypeId] = triggerType;
    });
    actionTypes.forEach((actionType) => {
      nodeTypeByIds[actionType.actionTypeId] = actionType;
    });
    return nodeTypeByIds;
  }, [triggerTypes, actionTypes]);
};

export const getDefaultSchema = (timeZone: string) => {
  const defaultFormData = {
    type: 'Expression',
    value: {
      operator: 'newObject',
      operands: [
        'timeZone',
        {
          type: 'Literal',
          value: timeZone,
        },
      ],
    },
  };
  return defaultFormData;
};

// For triggers where there is only one option and a default value when the record is created,
// the trigger is created with the default form information.
export const useDefaultTriggerFormData = () => {
  const value = useAtomValue(automationStateAtom);
  const datasheetId = value?.resourceId ?? '';
  const defaultFormData = {
    type: 'Expression',
    value: {
      operator: 'newObject',
      operands: [
        'datasheetId',
        {
          type: 'Literal',
          value: datasheetId,
        },
      ],
    },
  };
  return defaultFormData;
};

export const useDefaultRobotDesc = () => {
  const robotTriggerType = useRobotTriggerTypes();
  const robotActionTypesOriginal = useRobotActionTypes();
  const robotActionTypes = robotActionTypesOriginal?.filter(Boolean);
  const comma = t(Strings.comma);

  const triggerResult = robotTriggerType
    ?.filter(Boolean)
    .map((actionType) => actionType!.name)
    .join(t(Strings.robot_trigger_or));

  return useMemo(() => {
    if (robotTriggerType != null && (isNil(robotActionTypes) || robotActionTypes?.length === 0)) {
      return t(Strings.automation_description_trigger, {
        triggerName: triggerResult,
      });
    }

    if (robotActionTypes?.length === 1) {
      const lastActionResult = robotActionTypes[robotActionTypes.length - 1]?.name;
      return t(Strings.automation_description_one, {
        triggerName: triggerResult,
        lastAction: lastActionResult,
      });
    }

    if (robotTriggerType && Array.isArray(robotActionTypes)) {
      const actionResult = robotActionTypes
        .slice(0, robotActionTypes.length - 1)
        .map((actionType) => actionType!.name)
        .join(comma);
      const lastActionResult = robotActionTypes[robotActionTypes.length - 1]?.name;

      return t(Strings.automation_description_more, {
        triggerName: triggerResult,
        actions: actionResult,
        lastAction: lastActionResult,
      });
    }
    return '';
  }, [robotTriggerType, robotActionTypes, comma]);
};

export const useShowRobot = () => {
  const isRobotFeatureOn = useAppSelector((state) => Selectors.labsFeatureOpen(state, SystemConfig.test_function.robot.feature_key));
  return isRobotFeatureOn || isPrivateDeployment(); // Privatization unconditionally opens the robot portal
};

export { useTriggerTypes, useActionTypes };
