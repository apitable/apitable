/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { produce } from 'immer';
import {
  IDelUnReadNoticeListAction, IGetNewMsgFromWsAndLookAction, INotification, IUpdateNewNoticeListFromWsAction, IUpdateReadMsgCountAction,
  IUpdateReadNoticeListAction, IUpdateUnreadMsgCountAction, IUpdateUnReadNoticeListAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

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
}, defaultState);
