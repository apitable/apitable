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

import axios from 'axios';
import SocketIO from 'socket.io-client';
import { INodeChangeSocketData, INoticeDetail, Navigation, StoreActions, Strings, t, Url } from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { canJumpWhenClickCard, getNoticeUrlParams, NotifyType, renderNoticeBody } from 'pc/components/notification/card/utils';
import { navigationToConfigUrl, PublishController } from 'pc/components/notification/publish/controller';
import { NoticeTemplatesConstant, requestWebNotification } from 'pc/components/notification/utils';
import { Method } from 'pc/components/route_manager/const';
import { joinPath } from 'pc/components/route_manager/helper';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';
import { getInitializationData } from './utils/env';

const PublishNotifyList = [
  NoticeTemplatesConstant.web_publish,
  NoticeTemplatesConstant.server_pre_publish,
  NoticeTemplatesConstant.common_system_notify,
  NoticeTemplatesConstant.common_system_notify_web,
];
// Notification Center messages do not exist
const NotInNotificationCenterList = [NoticeTemplatesConstant.web_publish, NoticeTemplatesConstant.common_system_notify_web];

export class NotificationStore {
  static socket: SocketIOClient.Socket;

  static init(userId: string, spaceId?: string) {
    this.destroy();
    console.log('NotificationStore initialized');
    this.socket = this.openWsNotification(userId, spaceId);
  }

  static openWsNotification(userId: string, spaceId?: string) {
    const version = getInitializationData().version;
    const ws = SocketIO('', {
      path: Url.NOTIFICATION_PATH,
      query: {
        userId: userId,
        version,
        spaceId,
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

    ws.on('NOTIFY', (data: INoticeDetail) => {
      console.log('Receive real-time messages: ', data);
      const templateId = data.templateId;
      if(['subscribed_record_archived', 'subscribed_record_unarchived'].includes(templateId)) return;
      // Browser notifications
      if (!PublishNotifyList.includes(templateId)) {
        requestWebNotification({
          options: {
            body: renderNoticeBody(data, { pureString: true }) as string,
          },
          onClick: () => {
            const { spaceId, nodeId, viewId, recordId, configPathname, toastUrl, notifyType, notifyId } = getNoticeUrlParams(data);

            let query: any;
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
      // Update the number of new messages on the Notification Center page
      if (!NotInNotificationCenterList.includes(templateId)) {
        store.dispatch(StoreActions.updateNewNoticeListFromWs(data));
      }
      // Handling of special messages
      renderNoticeUi(data);
    });

    ws.on('NODE_CHANGE', (data: INodeChangeSocketData) => {
      store.dispatch(StoreActions.updateSocketData({ ...data, receiptTime: Date.now() }));
      store.dispatch(StoreActions.getSpaceInfo(spaceId || ''));
    });
    return ws;
  }

  static joinSpace(spaceId: string) {
    this.socket.emit('WATCH_SPACE', { spaceId }, (result: any) => {
      if (!result) {
        console.log('Failed to join space');
      }
    });
  }

  // recently browsed node
  static recentlyBrowsedNode(nodeId: string) {
    this.socket?.emit('NODE_BROWSED', { nodeId }, (result: any) => {
      if (!result) {
        console.log('NODE_BROWSED fail');
      }
    });
  }

  static destroy() {
    this.socket?.removeAllListeners();
    this.socket?.close();
  }
}

// Handling of special messages
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
            Router.push(Navigation.HOME);
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
            Router.redirect(Navigation.WORKBENCH);
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
