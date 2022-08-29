import keyBy from 'lodash/keyBy';
import { RESET_UNIT_INFO, UPDATE_UNIT_MAP, UPDATE_USER_MAP } from 'store/action_constants';
import { IUnitMap } from 'store/interface';
import { searchUnitInfoVo } from 'api/api';

export interface IUpdateUnitMapAction {
  type: typeof UPDATE_UNIT_MAP;
  payload: IUnitMap;
}

export interface IUpdateUserMapAction {
  type: typeof UPDATE_USER_MAP;
  payload: IUnitMap;
}

export interface IResetUnitInfoAction {
  type: typeof RESET_UNIT_INFO;
}

export const updateUnitMap = (unitMap: IUnitMap) => {
  return {
    type: UPDATE_UNIT_MAP,
    payload: unitMap,
  };
};

export const updateUserMap = (userMap: IUnitMap) => {
  return {
    type: UPDATE_USER_MAP,
    payload: userMap,
  };
};

export const resetUnitInfo = () => {
  return {
    type: RESET_UNIT_INFO,
  };
};

// 加载缺失的 unit 信息
export const loadLackUnitMap = (names: string, linkId?: string,) => {
  return async dispatch => {
    if (!names.length) {
      return;
    }
    const { data: { data: resData }} = await searchUnitInfoVo(names, linkId);
    if (!resData.length) {
      return;
    }
    // FIXME: 修改这里的类型
    return dispatch(updateUnitMap(keyBy(resData, 'unitId')));
  };
};
