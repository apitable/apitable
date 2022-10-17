import { Api, INoticeDetail, Navigation, StoreActions, Strings, t } from '@vikadata/core';
import { triggerUsageAlert } from 'pc/common/billing';
import { Message } from 'pc/components/common';
import { PublishControllers } from 'pc/components/notification/publish';
import { Router } from 'pc/components/route_manager/router';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

export const useNotificationRequest = () => {
  const dispatch = useDispatch();
  const readCount = useSelector(state => state.notification.readCount);
  // 获取通知数量
  const notificationStatistics = () =>
    Api.getNotificationStatistics().then(res => {
      const { data, success } = res.data;
      if (success) {
        dispatch(StoreActions.updateUnReadMsgCount(data.unReadCount));
        dispatch(StoreActions.updateReadMsgCount(data.readCount));
      }
      return res;
    });

  // 获取通知分页列表
  const getNotificationPage = (
    isRead: boolean,
    rowNo?: number,
  ) => {
    return Api.getNotificationPage(isRead, rowNo).then(res => {
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
  // 获取通知列表
  const getNotificationList = (
    isRead?: boolean,
    notifyType?: string,
  ) => {
    return Api.getNotificationList(isRead, notifyType).then(res => {
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
  // 获取新的通知数量以及通知列表
  const getNoticeCountAndList = () => {
    return Api.getNotificationStatistics().then(res => {
      const { data, success } = res.data;
      if (!success) {
        return;
      }
      const { unReadCount, readCount } = data;
      batchActions([
        dispatch(StoreActions.updateUnReadMsgCount(data.unReadCount)),
        dispatch(StoreActions.updateReadMsgCount(data.readCount)),
      ]);
      if (unReadCount > 0) {
        getNotificationPage(false);
      }
      if (readCount > 0) {
        getNotificationPage(true);
      }
    });
  };
  // 单个消息标记通知为已读
  const transferNoticeToRead = (notice: INoticeDetail[]) => {
    const idArr = notice.map(item => item.id);
    return Api.transferNoticeToRead(idArr, false).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.delUnReadNoticeList(idArr, false));
        dispatch(StoreActions.updateReadNoticeList(notice, true, false, true));
      }
    });
  };
  // 单个消息处理之后，需要重新请求已处理消息列表
  const transferNoticeToReadAndRefresh = (notice: INoticeDetail[]) => {
    const idArr = notice.map(item => item.id);
    return Api.transferNoticeToRead(idArr, false).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.delUnReadNoticeList(idArr, false));
        getNotificationPage(true);
        dispatch(StoreActions.updateReadMsgCount(readCount + notice.length));
      }
    });
  };
  return {
    notificationStatistics, getNotificationPage, transferNoticeToRead, getNoticeCountAndList,
    transferNoticeToReadAndRefresh, getNotificationList,
  };

};

export const useNotificationCreate = ({ spaceId }: { fromUserId: string, spaceId: string }) => {
  const dispatch = useDispatch();
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  // 空间权限变为普通成员，即删除子管理员操作
  const delSubAdminAndNotice = (memberId: string) => {
    return Api.deleteSubAdmin(memberId).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getSubAdminList(1));
        Message.success({ content: t(Strings.delete_sub_admin_success) });
      } else {
        Message.error({ content: t(Strings.delete_sub_admin_fail) });
      }
    });
  };
  // 添加子管理员
  const addSubAdminAndNotice = (
    memberIds: string[],
    resourceCodes: string[],
    cancel: () => void,
  ) => {
    return Api.addSubMember(memberIds, resourceCodes).then(res => {
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

  // 空间名称更改
  const changeSpaceNameAndNotice = (
    spaceId: string,
    name: string,
    cancel: () => void,
  ) => {
    return Api.updateSpace(name).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.update_space_success) });
        Api.spaceInfo(spaceId).then(res => {
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

  // 成员退出
  const memberQuitSpaceAndNotice = (quitSpaceId: string, successFn?: () => void) => {
    return Api.quitSpace(quitSpaceId).then(res => {
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

