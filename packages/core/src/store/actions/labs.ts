import { ActionConstants } from 'store';
import { ILabs } from 'store/interface';

/**
 * 获取已开启实验性功能
 */
export const setLabs = (labs: ILabs) => {
  return {
    type: ActionConstants.SET_LABS,
    payload: labs,
  };
};

