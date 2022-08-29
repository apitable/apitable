import { IUnitInfo } from 'store/interface';
import { IResetUnitInfoAction, IUpdateUnitMapAction, IUpdateUserMapAction } from 'store/actions';
import produce from 'immer';
import { RESET_UNIT_INFO, UPDATE_UNIT_MAP, UPDATE_USER_MAP } from 'store/action_constants';

const defaultState: IUnitInfo = {
  unitMap: null,
  userMap: null,
};

type IUnitInfoAction = IUpdateUnitMapAction | IUpdateUserMapAction | IResetUnitInfoAction;

const updateUnitMap = (oldUnitMap, newUnitMap) => {
  return {
    ...(oldUnitMap || {}),
    ...newUnitMap,
  };
};

const updateUserMap = (oldUserMap, newUserMap) => {
  if (!oldUserMap) {
    oldUserMap = {};
  }
  const _unitMap = {};
  for (const k in newUserMap) {
    const value = newUserMap[k];
    if (value.unitId) {
      oldUserMap[k] = value.unitId;
      _unitMap[value.unitId] = value;
      continue;
    }
    oldUserMap[k] = value;
  }
  return { oldUserMap, _unitMap };
};

export const unitInfo = produce(
  (state = defaultState, action: IUnitInfoAction) => {
    switch (action.type) {
      case UPDATE_UNIT_MAP: {
        state.unitMap = updateUnitMap(state.unitMap, action.payload);
        break;
      }
      case UPDATE_USER_MAP: {
        const { oldUserMap: userMap, _unitMap } = updateUserMap(state.userMap, action.payload);
        const unitMap = updateUnitMap(state.unitMap, _unitMap);
        state.userMap = userMap;
        state.unitMap = unitMap;
        break;
      }
      case RESET_UNIT_INFO: {
        return defaultState;
      }
    }
    return state;
  }
);
