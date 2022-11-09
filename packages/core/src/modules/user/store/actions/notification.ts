import * as actions from '../../../shared/store/action_constants';
import { INoticeDetail } from '../../../../exports/store/interfaces';

/**
 * update unread notification count
 * @param count 
 * @returns 
 */
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

/**
 * update notification that have read
 * @param list 
 * @param unshift 
 * @param push 
 * @param updateCount 
 * @returns 
 */
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
