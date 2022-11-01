import keyBy from 'lodash/keyBy';
import { RESET_UNIT_INFO, UPDATE_UNIT_MAP, UPDATE_USER_MAP } from 'store/action_constants';
import { IUnitMap } from 'store/interface';
import { Api } from 'api';

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

/**
 * load the missing unit information
 * @param names 
 * @param linkId 
 * @returns 
 */
export const loadLackUnitMap = (names: string, linkId?: string,) => {
  return async (dispatch: any) => {
    if (!names.length) {
      return;
    }
    const { data: { data: resData }} = await Api.searchUnitInfoVo(names, linkId);
    if (!resData.length) {
      return;
    }
    // FIXME: edit type
    return dispatch(updateUnitMap(keyBy(resData, 'unitId')));
  };
};
