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

import { atom, useAtom, useAtomValue } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { isNil } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigConstant, getLanguage, isPrivateDeployment, Selectors, Strings, SystemConfig, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { useAllColumns } from 'pc/hooks';
import { useAutomationController, automationStateAtom } from '../automation/controller';
import { useAutomationList } from '../automation/controller/use_robot_list';
import { activeRobot, deActiveRobot, deleteRobotAction, nestReq } from './api';
import { getFilterActionTypes } from './helper';
import { IActionType, INodeType, ITriggerType } from './interface';
import { IAutomationRobotDetailItem } from './robot_context';
import { loadableWithDefault } from './robot_detail/api';
import { getFields } from './robot_detail/trigger/helper';
import { getActionList } from './robot_detail/utils';
import { covertThemeIcon } from './utils';

export const useAllFieldsByDstId = (datasheetId: string) => {
  const columns = useAllColumns(datasheetId, true);
  const snapshot = useSelector((state) => {
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
  const snapshot = useSelector((state) => {
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
      if (currentRobotId&& state?.resourceId && state?.robot?.robotId) {
        return deleteRobotAction(state?.resourceId, actionId, state.robot?.robotId);
      }
      return false;
    },
    [currentRobotId, state?.resourceId, state?.robot?.robotId],
  );
};

export const useToggleRobotActive = (resourceId: string, robotId: string) => {
  const [loading, setLoading] = useState(false);

  const { api: { refreshItem } } = useAutomationController();
  //
  const toggleRobotActive = useCallback(async (isActive: boolean) => {
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

        Message.success({
          content: t(Strings.automation_enabled),
        });
      } else {
        Message.error({
          content: t(Strings.robot_enable_config_incomplete_error),
        });
      }
    }
  }, [robotId, refreshItem]);

  return {
    toggleRobotActive,
    loading,
  };
};

export const useRobotTriggerType = () => {
  const { data: triggerTypes } = useTriggerTypes();

  const [state] = useAtom(automationStateAtom);

  return useMemo(() => {
    if (!state?.robot) {
      return null;
    }
    if (state?.robot) {
      const data = state?.robot;
      return data.triggers.map((action) => triggerTypes?.find((trigger) => trigger.triggerTypeId === action.triggerTypeId));
    }

    return null;

  }, [triggerTypes, state]);
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
    return getActionList(robot.actions.map(item => ({
      ...item,
      id: item.actionId
    }))).map((action) => actionTypes?.find((actionType) => actionType.actionTypeId === action.actionTypeId));
  },
  [actionTypes, state]
  );
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

const fetchTriggerTypesAtom = atom(`/automation/trigger-types?lang=${getLanguage()}`);

const [triggerTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/trigger-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const r = await nestReq.get(String(url));
    return r?.data?.data;
  },
}));

const loadableTriggerAtom = loadableWithDefault(triggerTypesAtom, []);

const [actionTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/action-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const r = await nestReq.get(String(url));
    return r?.data?.data;
  },
}));

const loadableActionTypesAtom = loadableWithDefault(actionTypesAtom, []);

export const useTriggerTypes = (): { loading: boolean; data: ITriggerType[] } => {
  const themeName = useSelector((state) => state.theme);
  const value = useAtomValue(loadableTriggerAtom);
  if(value.loading) {
    return {
      loading: true,
      data: []
    };
  }
  return {
    loading: false,
    data: covertThemeIcon(value.data, themeName),
  };
};

export const useActionTypes = (): { loading: boolean; originData: IActionType[]; data: IActionType[] } => {
  const themeName = useSelector((state) => state.theme);
  const actionTypeData = useAtomValue(loadableActionTypesAtom);
  const themedList = covertThemeIcon(actionTypeData?.data, themeName);
  if(actionTypeData.loading) {
    return {
      loading: true,
      data: [],
      originData: [],
    };
  }
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
    triggerTypes.forEach((triggerType) => {
      nodeTypeByIds[triggerType.triggerTypeId] = triggerType;
    });
    actionTypes.forEach((actionType) => {
      nodeTypeByIds[actionType.actionTypeId] = actionType;
    });
    return nodeTypeByIds;
  }, [triggerTypes, actionTypes]);
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
  const robotTriggerType = useRobotTriggerType();
  const robotActionTypesOriginal = useRobotActionTypes();
  const robotActionTypes = robotActionTypesOriginal?.filter(Boolean);
  const comma = t(Strings.comma);

  return useMemo(() => {
    const triggerResult = robotTriggerType
      ?.filter(Boolean)
      .map((actionType) => actionType!.name)
      .join(comma);

    if(robotTriggerType != null && (isNil(robotActionTypes) || robotActionTypes?.length === 0)){
      return t(Strings.automation_description_trigger, {
        triggerName: triggerResult,
      });
    }

    if (robotActionTypes?.length === 1) {
      const triggerResult = robotTriggerType
        ?.filter(Boolean)
        .map((actionType) => actionType!.name)
        .join(comma);
      const lastActionResult = robotActionTypes[robotActionTypes.length - 1]?.name;
      return t(Strings.automation_description_one, {
        triggerName: triggerResult,
        lastAction: lastActionResult,
      });
    }

    if (robotTriggerType && Array.isArray(robotActionTypes)) {
      const triggerResult = robotTriggerType
        ?.filter(Boolean)
        .map((actionType) => actionType!.name)
        .join(comma);
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
  }, [robotTriggerType, robotActionTypes]);
};

export const useShowRobot = () => {
  const isRobotFeatureOn = useSelector((state) => Selectors.labsFeatureOpen(state, SystemConfig.test_function.robot.feature_key));
  return isRobotFeatureOn || isPrivateDeployment(); // Privatization unconditionally opens the robot portal
};

