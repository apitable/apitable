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
