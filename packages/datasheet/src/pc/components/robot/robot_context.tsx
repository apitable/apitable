import produce from 'immer';
import { createContext, useReducer } from 'react';
import { IRobotContext } from './interface';

const initState = {
  triggerTypes: [],
  actionTypes: [],
  robotList: [],
  isNewRobotModalOpen: false,
  isEditingRobotName: false,
  isEditingRobotDesc: false,
};

export const RobotContext = createContext<{
  state: IRobotContext,
  dispatch: React.Dispatch<any>
}>({ state: initState, dispatch: () => { } });

const reducer = (state: IRobotContext, action) => {
  switch (action.type) {
    case 'setIsEditingRobotName':
      return produce(state, draft => {
        draft.isEditingRobotName = action.payload;
      });
    case 'setIsEditingRobotDesc':
      return produce(state, draft => {
        draft.isEditingRobotDesc = action.payload;
      });
    case 'setTriggerTypes':
      return {
        ...state,
        triggerTypes: action.payload.triggerTypes,
      };
    case 'setActionTypes':
      return {
        ...state,
        actionTypes: action.payload.actionTypes,
      };
    case 'toggleNewRobotModal':
      return {
        ...state,
        isNewRobotModalOpen: !state.isNewRobotModalOpen,
      };
    case 'setCurrentRobotId':
      return {
        ...state,
        currentRobotId: action.payload.currentRobotId,
      };
    case 'setIsHistory':
      return {
        ...state,
        isHistory: action.payload.isHistory,
      };
    case 'updateRobot':
      const { robotList } = state;
      const { robot } = action.payload;
      const newRobotList = produce(robotList, draft => {
        const robotIndex = draft.findIndex(item => item.robotId === robot.robotId);
        if (robotIndex > -1) {
          const oldRobot = draft[robotIndex];
          draft[robotIndex] = {
            ...oldRobot,
            ...robot,
          };
        }
        return draft;
      });
      return {
        ...state,
        robotList: newRobotList
      };
    case 'updateRobotList':
      return {
        ...state,
        robotList: action.payload.robotList
      };
    default:
      throw new Error('error action type');
  }
};

export const RobotContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return <RobotContext.Provider value={{ state, dispatch }}>
    {props.children}
  </RobotContext.Provider>;
};