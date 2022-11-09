import { IReduxState, IUnitMap } from '../../../../store/interfaces';
import { createSelector } from 'reselect';

export const getUnitMap = (state: IReduxState): IUnitMap | null => {
  return state.unitInfo.unitMap;
};

const getUserMapBase = (state: IReduxState) => {
  return state.unitInfo.userMap;
};

export const getUserMap = createSelector(
  [getUnitMap, getUserMapBase], (unitMap, userMap) => {
    if (!userMap) {
      return null;
    }
    const _userMap = {};
    for (const userId in userMap) {
      const userValue = userMap[userId];
      if (userValue == null) {
        continue;
      }
      if (typeof userValue === 'string') {
        if (!unitMap) {
          continue;
        }
        const unit = unitMap[userValue];
        if (!unit) {
          continue;
        }
        _userMap[userId] = unit;
      } else {
        _userMap[userId] = userValue;
      }
    }
    return _userMap;
  }
);
