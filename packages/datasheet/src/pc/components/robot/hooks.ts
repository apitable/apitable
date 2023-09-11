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
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import {
  ConfigConstant,
  getLanguage,
  isPrivateDeployment,
  Selectors,
  Strings,
  SystemConfig,
  t,
  ThemeName
} from '@apitable/core';
import { Message } from 'pc/components/common';
import { useAllColumns } from 'pc/hooks';
import { automationStateAtom } from '../automation/controller';
import { activeRobot, deActiveRobot, deleteRobotAction, nestReq } from './api';
import { getFilterActionTypes } from './helper';
import { IActionType, INodeType, ITriggerType } from './interface';
import { IAutomationRobotDetailItem } from './robot_context';
import { getFields } from './robot_detail/trigger/helper';
import { useRobotListState } from './robot_list';

export const useAllFields = () => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const columns = useAllColumns(datasheetId, true);
  const snapshot = useSelector(state => {
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
  const permissions = useSelector(Selectors.getPermissions);
  const { state: { data: robotList }} = useRobotListState();
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
  return useCallback((actionId: string) => {
    if (currentRobotId) {
      return deleteRobotAction(actionId);
    }
    return false;
  }, [currentRobotId]);
};

export const useToggleRobotActive = (resourceId: string, robotId: string) => {
  const [loading, setLoading] = useState(false);

  const { api: { getById, refreshItem }} = useRobotListState();

  const robot = getById(robotId);

  const toggleRobotActive = useCallback(async() => {
    if(!robot) {
      return;
    }
    if (robot.isActive) {
      setLoading(true);
      const ok = await deActiveRobot(robotId);

      setLoading(false);
      if (ok) {
        refreshItem();
      }
    } else {
      setLoading(true);
      const ok = await activeRobot(robotId);
      setLoading(false);
      if (ok) {

        refreshItem();

        Message.success({
          content: t(Strings.automation_enabled)
        });
      } else {

        Message.error({
          content: t(Strings.robot_enable_config_incomplete_error)
        });
      }
    }
  }, [robot, robotId, refreshItem]);

  return {
    toggleRobotActive,
    loading
  };
};

export const useRobotTriggerType = () => {
  const { data: triggerTypes } = useTriggerTypes();

  const [state] = useAtom(automationStateAtom);
  if(!state?.robot) {
    return null;
  }
  if(state?.robot) {
    const data = state?.robot;
    return data.triggers.map(action => triggerTypes?.find(trigger => trigger.triggerTypeId === action.triggerTypeId));
  }

  return null;
};

export const useRobotActionTypes = () => {
  const [state] = useAtom(automationStateAtom);
  const { data: actionTypes } = useActionTypes();
  if(!state?.robot) {
    return null;
  }
  const robot =state.robot;
  return robot.actions.map(action => actionTypes?.find(actionType => actionType.actionTypeId === action.actionTypeId));
};

export const useRobot = () => {

  const [state, setState] = useAtom(automationStateAtom);
  const currentRobotId = state?.currentRobotId;

  return {
    resourceId: state?.resourceId,
    currentRobotId,
    robot: state?.robot,
    reset: () => {
      setState(state => ({
        ...state,
        robot: undefined,
        currentRobotId: undefined,
      }));
    },
    updateRobot: (data: Partial<IAutomationRobotDetailItem>) => {
      if(!state?.robot) {
        return;
      }
      setState({ ...state,
        robot: { ...state.robot,
          ...data
        }
      });

    }
  };
};

const covertThemeIcon = (data: (ITriggerType | IActionType)[] | undefined, theme: ThemeName) => {
  return data?.map(item => {
    return {
      ...item,
      service: {
        ...item.service,
        logo: (theme === ThemeName.Dark ? item.service.themeLogo?.dark : item.service.themeLogo?.light) || item.service.logo
      }
    };
  }) as any || [];
};

export const useTriggerTypes = (): { loading: boolean; data: ITriggerType[] } => {
  const { data: triggerTypeData, error: triggerTypeError } = useSWR(`/automation/trigger-types?lang=${getLanguage()}`, nestReq);
  const themeName = useSelector(state => state.theme);
  if (!triggerTypeData || triggerTypeError) {
    return {
      loading: true,
      data: (triggerTypeData?.data.data)
    };
  }
  return {
    loading: false,
    data: covertThemeIcon(triggerTypeData.data.data, themeName)
  };
};

export const useActionTypes = (): { loading: boolean;originData : IActionType[], data: IActionType[] } => {
  const { data: actionTypeData, error: actionTypeError } = useSWR(`/automation/action-types?lang=${getLanguage()}`, nestReq);
  const themeName = useSelector(state => state.theme);

  if (!actionTypeData || actionTypeError) {
    return {
      loading: true,
      data: getFilterActionTypes(actionTypeData?.data.data),
      originData: actionTypeData?.data.data,
    };
  }
  const themedList = covertThemeIcon(actionTypeData?.data.data, themeName);
  return {
    loading: false,
    originData: themedList,
    data: getFilterActionTypes(themedList),
  };
};

export const useNodeTypeByIds = () => {
  const { data: actionTypes } = useActionTypes();
  const { data: triggerTypes } = useTriggerTypes();
  return useMemo(() => {
    const nodeTypeByIds: {
      [nodeTypeId: string]: INodeType;
    } = {};
    triggerTypes.forEach(triggerType => {
      nodeTypeByIds[triggerType.triggerTypeId] = triggerType;
    });
    actionTypes.forEach(actionType => {
      nodeTypeByIds[actionType.actionTypeId] = actionType;
    });
    return nodeTypeByIds;
  }, [triggerTypes, actionTypes]);
};

// For triggers where there is only one option and a default value when the record is created,
// the trigger is created with the default form information.
export const useDefaultTriggerFormData = () => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const defaultFormData = {
    type: 'Expression',
    value: {
      operator: 'newObject',
      operands: [
        'datasheetId',
        {
          type: 'Literal',
          value: datasheetId
        }

      ]
    }
  };
  return defaultFormData;
};

export const useDefaultRobotDesc = () => {
  const robotTriggerType = useRobotTriggerType();
  const robotActionTypesA = useRobotActionTypes();
  const robotActionTypes= robotActionTypesA?.filter(Boolean);
  const comma = t(Strings.comma);

  if(robotActionTypes?.length ===1 ) {
    const actionResult = robotActionTypes?.filter(Boolean).map(actionType => actionType!.name).join(comma);
    const triggerResult = robotTriggerType?.filter(Boolean).map(actionType => actionType!.name).join(comma);
    const lastActionResult = robotActionTypes[robotActionTypes.length - 1]?.name;
    return t(Strings.automation_description_one, {
      triggerName: triggerResult,
      lastAction: lastActionResult,
    });
  }

  if (robotTriggerType && Array.isArray(robotActionTypes)) {
    const triggerResult = robotTriggerType?.filter(Boolean).map(actionType => actionType!.name).join(comma);
    const actionResult = robotActionTypes.slice(0, robotActionTypes.length - 1).map(actionType => actionType!.name).join(comma);
    const lastActionResult = robotActionTypes[robotActionTypes.length - 1]?.name;

    return t(Strings.automation_description_more, {
      triggerName: triggerResult,
      actions:actionResult,
      lastAction: lastActionResult,
    });
  }
  return '';
};

export const useShowRobot = () => {
  const isRobotFeatureOn = useSelector(state => Selectors.labsFeatureOpen(state, SystemConfig.test_function.robot.feature_key));
  return isRobotFeatureOn || isPrivateDeployment(); // Privatization unconditionally opens the robot portal
};
