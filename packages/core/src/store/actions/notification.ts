import * as actions from '../action_constants';
import { INoticeDetail } from '../interface';

// 更新消息数量
export const updateUnReadMsgCount = (count: number) => {
  return {
    type: actions.UPDATE_UNREAD_MSG_COUNT,
    payload: count,
  };
};

export const updateReadMsgCount = (count: number) => {
  return {
    type: actions.UPDATE_READ_MSG_COUNT,
    payload: count,
  };
};

// 更新消息列表
export const updateReadNoticeList = (
  list: INoticeDetail[],
  unshift?: boolean,
  push?: boolean,
  updateCount?: boolean,
) => {
  return {
    type: actions.UPDATE_READ_NOTICE_LIST,
    payload: { list, unshift, push, updateCount },
  };
};

export const updateUnReadNoticeList = (
  list: INoticeDetail[],
  unshift?: boolean,
  push?: boolean,
  updateCount?: boolean,
) => {
  return {
    type: actions.UPDATE_UNREAD_NOTICE_LIST,
    payload: { list, unshift, push, updateCount },
  };
};
export const delUnReadNoticeList = (idList: string[], isAll?: boolean) => {
  return {
    type: actions.DEL_UNREAD_NOTICE_LIST,
    payload: { idList, isAll },
  };
};

export const updateNewNoticeListFromWs = (notice: INoticeDetail) => {
  return {
    type: actions.UPDATE_NEW_NOTICE_LIST_FROM_WS,
    payload: notice,
  };
};

export const getNewMsgFromWsAndLook = (inNotice: boolean) => {
  return {
    type: actions.GET_NEW_MSG_FROM_WS_AND_LOOK,
    payload: inNotice,
  };
};
