import { ActionConstants } from 'store';
import { ILabs } from 'store/interface';

/**
 * set labs features
 */
export const setLabs = (labs: ILabs) => {
  return {
    type: ActionConstants.SET_LABS,
    payload: labs,
  };
};

