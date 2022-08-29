import { IMirrorMap } from 'core';
import { SET_MIRROR_MAP, SET_MIRROR } from '../../constant';

export interface ISetMirrorMapAction {
  type: typeof SET_MIRROR_MAP;
  payload: IMirrorMap;
}

export const setMirrorMapAction = (payload: IMirrorMap): ISetMirrorMapAction => ({ type: SET_MIRROR_MAP, payload });

export interface ISetMirrorAction {
  type: typeof SET_MIRROR;
  payload: IMirrorMap;
}

export const setMirrorAction = (payload: IMirrorMap): ISetMirrorAction => ({ type: SET_MIRROR, payload });
