import * as actions from '../action_constants';

export type ILabs = string[];

export interface ILabsAction {
  type: typeof actions.SET_LABS;
  payload: ILabs;
}