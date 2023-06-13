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

// import { Message } from '@apitable/components';
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
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { activeRobot, deActiveRobot, deleteRobotAction, nestReq, refreshRobotList } from './api';
import { IActionType, INodeType, IRobotTrigger, ITriggerType } from './interface';
import { RobotContext } from './robot_context';
import { getFields } from './robot_detail/trigger/helper';

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
  const { state, dispatch } = useRobotContext();
  const canAddNewRobot = permissions.manageable && state.robotList && state.robotList.length < ConfigConstant.MAX_ROBOT_COUNT_PER_DST;
  const disableTip = permissions.manageable ? t(Strings.robot_reach_count_limit) : t(Strings.robot_share_page_create_tip);
  const toggleNewRobotModal = () => dispatch({ type: 'toggleNewRobotModal' });
  return {
    canAddNewRobot,
    disableTip,
    toggleNewRobotModal
  };
};

export const useDeleteRobotAction = () => {
  const { currentRobotId } = useRobot();
  return useCallback((actionId: string) => {
    if (currentRobotId) {
      return deleteRobotAction(actionId);
    }
    return false;
  }, [currentRobotId]);
};

export const useToggleRobotActive = (robotId: string) => {
  const [loading, setLoading] = useState(false);
  const { robot, updateRobot } = useRobot(robotId);
  const toggleRobotActive = useCallback(async() => {
    const { isActive } = robot!;
    if (isActive) {
      setLoading(true);
      const ok = await deActiveRobot(robotId);
      setLoading(false);
      if (ok) {
        updateRobot?.({
          ...robot,
          isActive: false
        });
      }
    } else {
      setLoading(true);
      const ok = await activeRobot(robotId);
      setLoading(false);
      if (ok) {
        updateRobot?.({
          ...robot,
          isActive: true
        });
      } else {
        updateRobot?.({
          ...robot,
          isActive: false
        });
        Message.error({
          content: t(Strings.robot_enable_config_incomplete_error)
        });
      }
    }
  }, [robot, robotId, updateRobot]);

  return {
    toggleRobotActive,
    loading
  };
};

export const useRobotContext = () => {
  const context = useContext(RobotContext);
  return context;
};

export const useRobotTriggerType = (robotId: string) => {
  const { state } = useContext(RobotContext);
  const { data: triggerTypes } = useTriggerTypes();
  const robot = state.robotList.find(robot => robot.robotId === robotId);
  const trigger = robot?.nodes[0] as IRobotTrigger;
  if (trigger) {
    return triggerTypes?.find(triggerType => triggerType.triggerTypeId === trigger.triggerTypeId);
  }
  return null;
};

export const useRobotActionTypes = (robotId: string) => {
  const { state } = useContext(RobotContext);
  const { data: actionTypes } = useActionTypes();
  const robot = state.robotList.find(robot => robot.robotId === robotId);
  const actions = robot?.nodes.slice(1);
  if (actions) {
    return actions.map(action => actionTypes?.find(actionType => actionType.actionTypeId === action.actionTypeId));
  }
  return null;
};

/**
 * Get the current robot by default, pass in robotId to get the specified robot
 * @param robotId
 */
export const useRobot = (_robotId?: string) => {
  const { state, dispatch } = useContext(RobotContext);
  const robotId = _robotId || state.currentRobotId;
  const setIsEditingRobotName = useCallback((isEditingRobotName: boolean) => {
    dispatch({ type: 'setIsEditingRobotName', payload: isEditingRobotName });
  }, [dispatch]);
  const setIsEditingRobotDesc = useCallback((isEditingRobotDesc: boolean) => {
    dispatch({ type: 'setIsEditingRobotDesc', payload: isEditingRobotDesc });
  }, [dispatch]);

  const setCurrentRobotId = useCallback((robotId?: string) => {
    dispatch({
      type: 'setCurrentRobotId',
      payload: {
        currentRobotId: robotId
      }
    });
  }, [dispatch]);

  const setIsHistory = useCallback((isHistory: boolean) => {
    dispatch({
      type: 'setIsHistory',
      payload: {
        isHistory
      }
    });
  }, [dispatch]);

  const updateRobot = useCallback((robot: any) => {
    dispatch({
      type: 'updateRobot',
      payload: {
        robot
      }
    });
  }, [dispatch]);

  const updateRobotList = useCallback((robotList: any) => {
    dispatch({
      type: 'updateRobotList',
      payload: {
        robotList: robotList || []
      }
    });
  }, [dispatch]);

  const createRobot = useCallback(async(robot: {
    resourceId: string;
    name?: string;
    description?: string;
  }) => {
    const res = await nestReq.post('/robots', robot);
    if (res.data.success) {
      refreshRobotList(robot.resourceId);
      return res.data.data.robotId as string;
    }
    return;
  }, []);

  return useMemo(() => {
    const res = {
      currentRobotId: state.currentRobotId,
      isHistory: state.isHistory,
      isEditingRobotName: state.isEditingRobotName,
      isEditingRobotDesc: state.isEditingRobotDesc,
      setCurrentRobotId,
      robot: null,
      updateRobot,
      updateRobotList,
      createRobot,
      setIsHistory,
      setIsEditingRobotName,
      setIsEditingRobotDesc,
    };
    if (state.robotList.length === 0 || robotId == null) {
      return res;
    }
    const robot = state.robotList.find(robot => robot.robotId === robotId);
    return {
      ...res,
      robot,
    };
  }, [
    state.currentRobotId,
    state.isHistory,
    state.robotList,
    state.isEditingRobotDesc,
    state.isEditingRobotName,
    robotId,
    setIsEditingRobotName,
    setIsEditingRobotDesc,
    setCurrentRobotId,
    setIsHistory,
    updateRobot,
    updateRobotList,
    createRobot,
  ]);
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
  const { data: triggerTypeData, error: triggerTypeError } = useSWR(`/robots/trigger-types?lang=${getLanguage()}`, nestReq);
  const { dispatch } = useRobotContext();
  const themeName = useSelector(state => state.theme);
  useEffect(() => {
    if (triggerTypeData?.data.data) {
      dispatch({
        type: 'setTriggerTypes',
        payload: {
          triggerTypes: covertThemeIcon(triggerTypeData?.data.data, themeName) || [],
        }
      });
    }
  }, [triggerTypeData, dispatch, themeName]);
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

export const useActionTypes = (): { loading: boolean; data: IActionType[] } => {
  const { data: actionTypeData, error: actionTypeError } = useSWR(`/robots/action-types?lang=${getLanguage()}`, nestReq);
  const { dispatch } = useRobotContext();
  const themeName = useSelector(state => state.theme);
  useEffect(() => {
    dispatch({
      type: 'setActionTypes',
      payload: {
        actionTypes: covertThemeIcon(actionTypeData?.data.data, themeName) || [],
      }
    });
  }, [actionTypeData?.data.data, dispatch, themeName]);
  if (!actionTypeData || actionTypeError) {
    return {
      loading: true,
      data: actionTypeData?.data.data
    };
  }
  return {
    loading: false,
    data: covertThemeIcon(actionTypeData?.data.data, themeName)
  };
};

export const useNodeTypeByIds = () => {
  const { state } = useRobotContext();
  return useMemo(() => {
    const nodeTypeByIds: {
      [nodeTypeId: string]: INodeType;
    } = {};
    state.triggerTypes.forEach(triggerType => {
      nodeTypeByIds[triggerType.triggerTypeId] = triggerType;
    });
    state.actionTypes.forEach(actionType => {
      nodeTypeByIds[actionType.actionTypeId] = actionType;
    });
    return nodeTypeByIds;
  }, [state.triggerTypes, state.actionTypes]);
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

export const useDefaultRobotDesc = (robotId: string) => {
  const robotTriggerType = useRobotTriggerType(robotId);
  const robotActionTypes = useRobotActionTypes(robotId);
  const comma = t(Strings.comma);
  if (robotTriggerType) {
    return t(Strings.robot_auto_desc) +
      robotTriggerType?.name + comma + robotActionTypes?.filter(Boolean).map(actionType => actionType!.name).join(comma);
  }
  return '';
};

export const useShowRobot = () => {
  const isRobotFeatureOn = useSelector(state => Selectors.labsFeatureOpen(state, SystemConfig.test_function.robot.feature_key));
  return isRobotFeatureOn || isPrivateDeployment(); // Privatization unconditionally opens the robot portal
};
