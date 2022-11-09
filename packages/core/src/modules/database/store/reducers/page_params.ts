import { SET_PAGE_PARAMS } from '../../../shared/store/action_constants';
import { IPageParams, ISetPageParamsAction } from '../../../../exports/store/interfaces';

const DEFAULT_PAGE_PARAMS: IPageParams = {
  datasheetId: '',
  viewId: '',
  resourceId: '',
};

export const pageParams = (state: IPageParams = DEFAULT_PAGE_PARAMS, action: ISetPageParamsAction) => {
  switch (action.type) {
    case SET_PAGE_PARAMS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
