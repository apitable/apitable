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

import * as actions from '../../../shared/store/action_constants';
export interface INotification {
  unReadCount: number;
  readCount: number;
  unReadNoticeList: INoticeDetail[];
  readNoticeList: INoticeDetail[];
  newNoticeListFromWs: INoticeDetail[]; // new notifications list from websocket push
}

// action

export interface IUpdateUnreadMsgCountAction {
  type: typeof actions.UPDATE_UNREAD_MSG_COUNT;
  payload: number;
}
export interface IUpdateReadMsgCountAction {
  type: typeof actions.UPDATE_READ_MSG_COUNT;
  payload: number;
}
export interface IUpdateReadNoticeListAction {
  type: typeof actions.UPDATE_READ_NOTICE_LIST;
  payload: {list: INoticeDetail[], unshift?: boolean, push?: boolean, updateCount?: boolean};
}
export interface IUpdateUnReadNoticeListAction {
  type: typeof actions.UPDATE_UNREAD_NOTICE_LIST;
  payload: {list: INoticeDetail[], unshift?: boolean, push?: boolean, updateCount?: boolean};
}
export interface IDelUnReadNoticeListAction {
  type: typeof actions.DEL_UNREAD_NOTICE_LIST;
  payload: {idList: string[], isAll?: boolean};
}
export interface IUpdateNewNoticeListFromWsAction {
  type: typeof actions.UPDATE_NEW_NOTICE_LIST_FROM_WS;
  payload: INoticeDetail;
}
export interface IGetNewMsgFromWsAndLookAction {
  type: typeof actions.GET_NEW_MSG_FROM_WS_AND_LOOK;
  payload: boolean;
}

// date interfaces start

export interface INoticeDetail {
  createdAt: string;
  id: string;
  rowNo: number;
  isRead: number;
  notifyType: string;
  notifyBody: INotifyBody;
  toUuid: string;
  fromUser: IFromUserInfo;
  templateId: string;
}

export interface IFromUserInfo {
  avatar: string;
  avatarColor?: number | null;
  nickName?: string;
  memberId: string;
  memberName: string;
  uuid: string;
  userName: string;
  playerType: number;
  isMemberNameModified?: boolean;
}

export interface INotifyBody {
  template: string;
  title: string;
  space: {
    spaceId: string;
    spaceName: string;
    logo: string;
  };
  node?: {
    nodeId: string;
    nodeName: string;
  };
  intent?: {
    url: string;
  };
  extras?: any;
}
