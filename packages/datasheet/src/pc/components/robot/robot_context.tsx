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
  state: IRobotContext;
  dispatch: React.Dispatch<any>;
}>({
  state: initState,
  dispatch: () => {},
});

const reducer = (state: IRobotContext, action: any) => {
  switch (action.type) {
    case 'setIsEditingRobotName':
      return produce(state, (draft) => {
        draft.isEditingRobotName = action.payload;
      });
    case 'setIsEditingRobotDesc':
      return produce(state, (draft) => {
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
      const newRobotList = produce(robotList, (draft) => {
        const robotIndex = draft.findIndex((item) => item.robotId === robot.robotId);
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
        robotList: newRobotList,
      };
    case 'updateRobotList':
      return {
        ...state,
        robotList: action.payload.robotList,
      };
    default:
      throw new Error('error action type');
  }
};

export const RobotContextProvider = (props: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return <RobotContext.Provider value={{ state, dispatch }}>{props.children}</RobotContext.Provider>;
};
