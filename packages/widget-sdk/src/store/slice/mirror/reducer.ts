import { IMirrorMap } from 'core';
import { SET_MIRROR_MAP, SET_MIRROR } from 'store/constant';
import { ISetMirrorAction, ISetMirrorMapAction } from './action';

export function mirrorMapReducer(state: IMirrorMap | undefined, action: ISetMirrorAction | ISetMirrorMapAction): IMirrorMap {
  switch (action.type) {
    case SET_MIRROR_MAP: {
      state = action.payload;
      return state || {};
    }
    case SET_MIRROR: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state || {};
  }
}