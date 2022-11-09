import { ActionConstants } from '../../../../exports/store';
import { ILabs } from '../../../../exports/store/interfaces';

/**
 * set labs features
 */
export const setLabs = (labs: ILabs) => {
  return {
    type: ActionConstants.SET_LABS,
    payload: labs,
  };
};

