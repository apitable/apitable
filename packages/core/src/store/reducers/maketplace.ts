import { SET_MARKETPLACE_APPS } from '../action_constants';
import { IApp, ISetMarketplaceAppsAction } from '../interface';

export const marketplaceApps = (state: IApp[] = [], action: ISetMarketplaceAppsAction) => {
  switch (action.type) {
    case SET_MARKETPLACE_APPS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
