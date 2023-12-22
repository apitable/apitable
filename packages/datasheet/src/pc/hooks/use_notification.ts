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

import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { Api, INoticeDetail, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { PublishControllers } from 'pc/components/notification/publish';
import { Router } from 'pc/components/route_manager/router';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';

export const useNotificationRequest = () => {
  const dispatch = useDispatch();
  const readCount = useAppSelector((state) => state.notification.readCount);
  // Number of notifications obtained
  const notificationStatistics = () =>
    Api.getNotificationStatistics().then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(StoreActions.updateUnReadMsgCount(data.unReadCount));
        dispatch(StoreActions.updateReadMsgCount(data.readCount));
      }
      return res;
    });

  // Get a paginated list of notifications
  const getNotificationPage = (isRead: boolean, rowNo?: number) => {
    return Api.getNotificationPage(isRead, rowNo).then((res) => {
      const { data, success } = res.data;
      if (success && rowNo === undefined) {
        if (isRead) {
          dispatch(StoreActions.updateReadNoticeList(data));
        } else {
          dispatch(StoreActions.updateUnReadNoticeList(data));
        }
      }
      if (success && rowNo !== undefined) {
        if (isRead) {
          dispatch(StoreActions.updateReadNoticeList(data, false, true));
        } else {
          dispatch(StoreActions.updateUnReadNoticeList(data, false, true));
        }
      }
    });
  };
  // Get a list of notifications
  const getNotificationList = (isRead?: boolean, notifyType?: string) => {
    return Api.getNotificationList(isRead, notifyType).then((res) => {
      const { data, success } = res.data;
      if (!success || isRead || !(data instanceof Array)) {
        return;
      }
      if (data.length > 0) {
        console.log('__________', data);
        // preShowPublishAlert({...data[0].notifyBody.extras, id: data[0].id});
        PublishControllers(data);
      }
    });
  };
  // Get the number of new notifications and the list of notifications
  const getNoticeCountAndList = () => {
    return Api.getNotificationStatistics().then((res) => {
      const { data, success } = res.data;
      if (!success) {
        return;
      }
      const { unReadCount, readCount } = data;
      batchActions([dispatch(StoreActions.updateUnReadMsgCount(data.unReadCount)), dispatch(StoreActions.updateReadMsgCount(data.readCount))]);
      if (unReadCount > 0) {
        getNotificationPage(false);
      }
      if (readCount > 0) {
        getNotificationPage(true);
      }
    });
  };
  // Single message mark notification as read
  const transferNoticeToRead = (notice: INoticeDetail[]) => {
    const idArr = notice.map((item) => item.id);
    return Api.transferNoticeToRead(idArr, false).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.delUnReadNoticeList(idArr, false));
        dispatch(StoreActions.updateReadNoticeList(notice, true, false, true));
      }
    });
  };
  // After a single message has been processed, the list of processed messages needs to be re-requested
  const transferNoticeToReadAndRefresh = (notice: INoticeDetail[]) => {
    const idArr = notice.map((item) => item.id);
    return Api.transferNoticeToRead(idArr, false).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.delUnReadNoticeList(idArr, false));
        getNotificationPage(true);
        dispatch(StoreActions.updateReadMsgCount(readCount + notice.length));
      }
    });
  };
  return {
    notificationStatistics,
    getNotificationPage,
    transferNoticeToRead,
    getNoticeCountAndList,
    transferNoticeToReadAndRefresh,
    getNotificationList,
  };
};

export const useNotificationCreate = ({ spaceId }: { fromUserId: string; spaceId: string }) => {
  const dispatch = useAppDispatch();
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  // Space permissions change to normal members, i.e. delete sub-admin operations
  const delSubAdminAndNotice = (memberId: string) => {
    return Api.deleteSubAdmin(memberId).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getSubAdminList(1));
        Message.success({ content: t(Strings.delete_sub_admin_success) });
      } else {
        Message.error({ content: t(Strings.delete_sub_admin_fail) });
      }
    });
  };
  // Add sub administrators
  const addSubAdminAndNotice = (memberIds: string[], resourceCodes: string[], cancel: () => void) => {
    return Api.addSubMember(memberIds, resourceCodes).then((res) => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.getSubAdminList(1));
        Message.success({ content: t(Strings.add_sub_admin_success) });
        triggerUsageAlert('maxAdminNums', { usage: spaceInfo!.adminNums + memberIds.length });
      } else {
        Message.error({ content: message });
      }
      cancel();
    });
  };

  // Space name change
  const changeSpaceNameAndNotice = (spaceId: string, name: string, cancel: () => void) => {
    return Api.updateSpace(name).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.update_space_success) });
        Api.spaceInfo(spaceId).then((res) => {
          const { data, success } = res.data;
          if (success) {
            dispatch(StoreActions.setSpaceInfo(data));
            dispatch(StoreActions.updateUserInfo({ spaceName: data.spaceName }));
          }
        });
      } else {
        Message.error({ content: t(Strings.update_space_fail) });
      }
      cancel();
    });
  };

  // Withdrawal of members
  const memberQuitSpaceAndNotice = (quitSpaceId: string, successFn?: () => void) => {
    return Api.quitSpace(quitSpaceId).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.message_exit_space_successfully) });
        dispatch(StoreActions.setQuitSpaceId(''));
        if (spaceId === quitSpaceId) {
          Router.redirect(Navigation.HOME);
        } else {
          successFn && successFn();
        }
      } else {
        Message.error({ content: t(Strings.message_exit_space_failed) });
      }
    });
  };

  return {
    addSubAdminAndNotice,
    changeSpaceNameAndNotice,
    memberQuitSpaceAndNotice,
    delSubAdminAndNotice,
  };
};
