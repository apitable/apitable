import * as actions from '../../../shared/store/action_constants';

export type ILabs = string[];

export interface ILabsAction {
  type: typeof actions.SET_LABS;
  payload: ILabs;
}