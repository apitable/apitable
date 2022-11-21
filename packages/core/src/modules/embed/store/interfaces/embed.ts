import * as actions from '../action_constants';

export interface IEmbedInfo {
    viewControl?: {
        viewId?: string,
        tabBar?: boolean,
        toolBar: {
            shareBtn?: boolean,
            widgetBtn?: boolean,
            apiBtn?: boolean,
            formBtn?: boolean,
            historyBtn?: boolean,
            robotBtn?: boolean,
      }, 
  },
  primarySideBar?: boolean, 
  bannerLogo?: boolean,
}

export interface IEmbedInfoAction {
  type: typeof actions.SET_EMBED_INFO;
  payload: IEmbedInfo;
}