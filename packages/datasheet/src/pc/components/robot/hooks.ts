// import { Message } from '@vikadata/components';
import { Message } from 'pc/components/common';
import { getLanguage, Selectors, Strings, t, ConfigConstant, isPrivateDeployment, SystemConfig } from '@vikadata/core';
import { useAllColumns } from 'pc/hooks';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { activeRobot, deActiveRobot, deleteRobotAction, nestReq, refreshRobotList, updateRobotName as APIUpdateRobotName } from './api';
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
        // TODO: 这里可以定位到表单出错的地方
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
 * 默认获取当前机器人，传入 robotId，则获取指定机器人
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

  const updateRobot = useCallback((robot) => {
    dispatch({
      type: 'updateRobot',
      payload: {
        robot
      }
    });
  }, [dispatch]);

  const updateRobotList = useCallback((robotList) => {
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

export const useTriggerTypes = (): { loading: boolean; data: ITriggerType[] } => {
  const { data: triggerTypeData, error: triggerTypeError } = useSWR(`/robots/trigger-types?lang=${getLanguage()}`, nestReq);
  const { dispatch } = useRobotContext();
  useEffect(() => {
    if (triggerTypeData?.data.data) {
      dispatch({
        type: 'setTriggerTypes',
        payload: {
          triggerTypes: triggerTypeData?.data.data || [],
        }
      });
    }
  }, [triggerTypeData, dispatch]);
  if (!triggerTypeData || triggerTypeError) {
    return {
      loading: true,
      data: triggerTypeData?.data.data
    };
  }
  return {
    loading: false,
    data: triggerTypeData.data.data
  };
};

export const useActionTypes = (): { loading: boolean; data: IActionType[] } => {
  const { data: actionTypeData, error: actionTypeError } = useSWR(`/robots/action-types?lang=${getLanguage()}`, nestReq);
  const { dispatch } = useRobotContext();
  useEffect(() => {
    dispatch({
      type: 'setActionTypes',
      payload: {
        actionTypes: actionTypeData?.data.data || [],
      }
    });
  }, [actionTypeData?.data.data, dispatch]);
  if (!actionTypeData || actionTypeError) {
    return {
      loading: true,
      data: actionTypeData?.data.data
    };
  }
  return {
    loading: false,
    data: actionTypeData?.data.data
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

export const useRobotDispatch = () => {
  const { dispatch } = useRobotContext();
  return dispatch;
};

export const useUpdateRobotName = () => {
  const dispatch = useRobotDispatch();
  const updateRobotName = useCallback(async(robotId, name) => {
    await APIUpdateRobotName(robotId, name);
    dispatch({
      type: 'updateRobot',
      payload: {
        robot: {
          robotId,
          name
        }
      }
    });
  }, [dispatch]);
  return updateRobotName;
};

// 对于当记录创建这种只有一个选项，且存在默认值的 trigger。在创建 trigger 带上默认的表单信息。
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
  return isRobotFeatureOn || isPrivateDeployment(); // 私有化无条件开启机器人入口
};