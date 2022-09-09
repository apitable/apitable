import { INodeChangeSocketData, INoticeDetail, Navigation, StoreActions, Strings, t, Url } from '@vikadata/core';
import axios from 'axios';
import { Modal } from 'pc/components/common';
import { canJumpWhenClickCard, getNoticeUrlParams, NotifyType, renderNoticeBody } from 'pc/components/notification/card/utils';
import { navigationToConfigUrl, PublishController } from 'pc/components/notification/publish/controller';
import { NoticeTemplatesConstant, requestWebNotification } from 'pc/components/notification/utils';
import { joinPath, Method, navigatePath, navigationToUrl } from 'pc/components/route_manager/use_navigation';
import { store } from 'pc/store';
import SocketIO from 'socket.io-client';
import { getInitializationData } from './utils/env';

const PublishNotifyList = [
  NoticeTemplatesConstant.web_publish,
  NoticeTemplatesConstant.server_pre_publish,
  NoticeTemplatesConstant.common_system_notify,
  NoticeTemplatesConstant.common_system_notify_web,
];
// 不存在通知中心的消息
const NotInNotificationCenterList = [NoticeTemplatesConstant.web_publish, NoticeTemplatesConstant.common_system_notify_web];

export class NotificationStore {
  static socket: SocketIOClient.Socket;

  static init(userId: string, spaceId?: string) {
    this.destroy();
    console.log('初始化 NotificationStore');
    this.socket = this.openWsNotification(userId, spaceId);
  }

  static openWsNotification(userId: string, spaceId?: string) {
    const version = getInitializationData().version;
    const ws = SocketIO('', {
      path: Url.NOTIFICATION_PATH,
      query: {
        userId: userId,
        version,
        spaceId
      },
      transports: ['websocket'],
      secure: true,
    });

    ws.on('disconnect', () => {
      let count = 1;
      const interval = window.setInterval(() => {
        if (ws.connected) {
          clearInterval(interval);
          return;
        }
        ws.connect();
        console.warn('! ' + `notify attempt to reconnect ${count++} ...`);
      }, 2000);
    });

    ws.on('connect', () => {
      console.log('connect');
      axios.defaults.headers.common['X-Socket-Id'] = ws.id;
      if (spaceId) {
        this.joinSpace(spaceId);
      }
      console.log('notification socket connected');
    });

    ws.on('NOTIFY', (data) => {
      console.log('收到实时消息: ', data);
      const templateId = data.templateId;
      // 浏览器通知
      if (!PublishNotifyList.includes(templateId)) {
        requestWebNotification({
          options: {
            body: renderNoticeBody(data, { pureString: true }) as string,
          },
          onClick: () => {
            const {
              spaceId,
              nodeId,
              viewId,
              recordId,
              configPathname,
              toastUrl,
              notifyType,
              notifyId
            } = getNoticeUrlParams(data);

            let query;
            if (notifyType === NotifyType.Record) {
              query = { comment: 1, notifyId };
            }
            const canJump = canJumpWhenClickCard(data);
            if (toastUrl) {
              navigationToConfigUrl(toastUrl);
              return;
            }
            if (!canJump) return;
            const url = new URL(window.location.origin);
            if (configPathname) {
              url.pathname = configPathname;
            }

            navigationToUrl(joinPath([url.href, nodeId, viewId, recordId]), {
              spaceId,
              method: Method.Push,
              query,
              clearQuery: true,
            });
          },
        });
      }
      // 更新通知中心页面的新消息数量
      if (!NotInNotificationCenterList.includes(templateId)) {
        store.dispatch(StoreActions.updateNewNoticeListFromWs(data));
      }
      // 特殊消息的处理
      renderNoticeUi(data);
    });

    ws.on('NODE_CHANGE', (data: INodeChangeSocketData) => {
      store.dispatch(
        StoreActions.updateSocketData({ ...data, receiptTime: Date.now() })
      );
    });
    return ws;
  }

  // 进入空间时
  static joinSpace(spaceId: string) {
    this.socket.emit('WATCH_SPACE', { spaceId }, (result) => {
      if (!result) {
        console.log('加入空间失败');
      }
    });
  }

  static destroy() {
    this.socket?.removeAllListeners();
    this.socket?.close();
  }
}

// 特殊消息的处理
export const renderNoticeUi = (data: INoticeDetail) => {
  const state = store.getState();
  const spaceId = state.space.activeId;
  const noticeSpaceId = data.notifyBody?.space?.spaceId;
  const inCurSpace = spaceId === noticeSpaceId;
  switch (data.templateId) {
    case NoticeTemplatesConstant.changed_ordinary_user: {
      inCurSpace &&
      Modal.warning({
        title: t(Strings.please_note),
        content: t(Strings.permission_removed_in_curspace_tip),
        okText: t(Strings.refresh),
        onOk: () => {
          navigatePath({ path: Navigation.HOME });
        },
      });
      break;
    }
    case NoticeTemplatesConstant.removed_from_space_touser: {
      inCurSpace &&
      Modal.warning({
        title: t(Strings.please_note),
        content: t(Strings.deleted_in_curspace_tip),
        okText: t(Strings.refresh),
        onOk: () => {
          navigatePath({ path: Navigation.SPACE, method: Method.Redirect });
        },
      });
      break;
    }
    case NoticeTemplatesConstant.common_system_notify:
    case NoticeTemplatesConstant.common_system_notify_web:
    case NoticeTemplatesConstant.web_publish:
    case NoticeTemplatesConstant.server_pre_publish:
    case NoticeTemplatesConstant.space_paid_notify: {
      PublishController(data);
      break;
    }
    default:
      break;
  }
};
