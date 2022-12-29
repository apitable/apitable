import {
  INotification,
  IUpdateUnreadMsgCountAction,
  IUpdateReadMsgCountAction,
  IUpdateReadNoticeListAction,
  IUpdateUnReadNoticeListAction,
  IDelUnReadNoticeListAction,
  IUpdateNewNoticeListFromWsAction,
  IGetNewMsgFromWsAndLookAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { produce } from 'immer';
const defaultState: INotification = {
  unReadCount: 0,
  readCount: 0,
  unReadNoticeList: [],
  readNoticeList: [],
  newNoticeListFromWs: [],
};

type INotificationActions = IUpdateUnreadMsgCountAction | IUpdateReadMsgCountAction
  | IUpdateReadNoticeListAction | IUpdateUnReadNoticeListAction | IDelUnReadNoticeListAction
  | IUpdateNewNoticeListFromWsAction | IGetNewMsgFromWsAndLookAction;

export const notification = produce((data: INotification = defaultState, action: INotificationActions) => {
  switch (action.type) {
    case actions.UPDATE_NEW_NOTICE_LIST_FROM_WS: {
      data.newNoticeListFromWs.unshift(action.payload);
      return data;
    }

    case actions.UPDATE_UNREAD_MSG_COUNT: {
      data.unReadCount = action.payload;
      return data;
    }

    case actions.UPDATE_READ_MSG_COUNT: {
      data.readCount = action.payload;
      return data;
    }

    case actions.UPDATE_READ_NOTICE_LIST: {
      const length = action.payload.list.length;
      const needUpdateCount = action.payload.updateCount;
      if (needUpdateCount) {
        data.readCount = data.readCount + length;
      }
      if (action.payload.unshift) {
        data.readNoticeList.unshift(...action.payload.list);
        return data;
      }
      if (action.payload.push) {
        data.readNoticeList.push(...action.payload.list);
        return data;
      }
      data.readNoticeList = action.payload.list;
      return data;
    }

    case actions.UPDATE_UNREAD_NOTICE_LIST: {
      const length = action.payload.list.length;
      const needUpdateCount = action.payload.updateCount;
      if (needUpdateCount) {
        data.unReadCount = data.unReadCount + length;
      }
      if (action.payload.unshift) {
        data.unReadNoticeList.unshift(...action.payload.list);
        return data;
      }
      if (action.payload.push) {
        data.unReadNoticeList.push(...action.payload.list);
        return data;
      }
      data.unReadNoticeList = action.payload.list;
      data.newNoticeListFromWs = [];
      return data;
    }

    case actions.DEL_UNREAD_NOTICE_LIST: {
      if (action.payload.isAll) {
        data.unReadNoticeList = [];
        data.unReadCount = 0;
        return data;
      } 
      const newUnReadNoticeList = data.unReadNoticeList.filter(item => !action.payload.idList.includes(item.id));
      data.unReadNoticeList = newUnReadNoticeList;
      data.unReadCount = data.unReadCount - action.payload.idList.length;
      return data;
    }

    case actions.GET_NEW_MSG_FROM_WS_AND_LOOK: {
      if (action.payload) {
        data.unReadNoticeList.unshift(...data.newNoticeListFromWs);
      }
      data.unReadCount = data.unReadCount + data.newNoticeListFromWs.length;
      data.newNoticeListFromWs = [];
      return data;
    }

    default:
      return data;
  }
});
