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
