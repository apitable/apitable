import { colors } from '@apitable/components';
import { Api, INoticeDetail, Navigation, StoreActions } from '@apitable/core';
import { showVikaby } from 'pc/components/enterprise/vikaby/vikaby';
import { IDingTalkModalType, showTipInDingTalk } from 'pc/components/economy/upgrade_modal';
import { isSocialDingTalk } from 'pc/components/home/social_platform';
import { Method } from 'pc/components/route_manager/const';
import { IQuery } from 'pc/components/route_manager/interface';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { showOrderModalAfterPay } from 'pc/components/subscribe_system/order_modal/pay_order_success';
import { store } from 'pc/store';
import { getPlatformType } from 'pc/utils/os';
import { dispatch } from 'pc/worker/store';
import { showBannerAlert } from '../banner_alert';
import { isUserInOldVersionOrLocal, NoticeTemplatesConstant, requestWebNotification, stringToActions } from '../utils';

export interface IToast {
  btnText?: string;
  closable?: boolean;
  title?: string;
  content: string;
  destroyPrev?: boolean;
  duration?: number;
  onBtnClick?: string[] | (() => void);
  onClose?: string[] | (() => void);
  showVikaby?: boolean;
  url?: string;
}

enum NotifyChannel {
  BANNER_ALERT = 'banner_alert',
  VIKABY_DIALOG = 'vikaby_dialog',
  WEB_NOTIFICATION = 'web_notification',
  NOTIFICATION_CENTER = 'notification_center',
}

const transformToastData = (toast: IToast, id: string) => {
  return {
    ...toast,
    id,
    onClose: () => {
      if (toast.onClose instanceof Array) {
        stringToActions(toast.onClose, id, toast.url);
      }
    },
    onBtnClick: () => {
      if (toast.onBtnClick instanceof Array) {
        stringToActions(toast.onBtnClick, id, toast.url);
      }
    },
  };
};

// For online users, all of them have to be processed, for offline users, only two types of ui need to be processed
export const PublishController = (props: INoticeDetail) => {
  const { notifyBody, id, templateId } = props;
  try {
    const { version, needVersionCompare, toast, channel, platform, socialPlatformType } = notifyBody.extras;
    // Applications that are not in the specified environment do not process notifications
    if (platform != null && platform !== getPlatformType()) {
      return;
    }
    const isVersionRuleTrue =
      !needVersionCompare ||
      (needVersionCompare && version && isUserInOldVersionOrLocal(version));
    if (!isVersionRuleTrue) {
      return;
    }

    const isSocialRulePassed = socialPlatformType === 2 ? isSocialDingTalk() : true;

    if (templateId === NoticeTemplatesConstant.space_paid_notify || templateId === NoticeTemplatesConstant.space_vika_paid_notify) {
      const state = store.getState();
      const spaceId = state.space.activeId;
      if (!spaceId || (notifyBody.space?.spaceId !== spaceId)) return;

      templateId === NoticeTemplatesConstant.space_paid_notify && showTipInDingTalk(IDingTalkModalType.Subscribe);
      templateId === NoticeTemplatesConstant.space_vika_paid_notify && showOrderModalAfterPay(colors.fc2, notifyBody.extras.orderType);

      Api.transferNoticeToRead([id], false).then(res => {
        const { success } = res.data;
        if (success) {
          dispatch(StoreActions.delUnReadNoticeList([id], false));
          dispatch(StoreActions.updateReadNoticeList([props], true, false, true));
        }
      });
      return;
    }

    const channelArr = channel.split(',');
    if (channelArr.length) {
      channelArr.forEach((uiKey) => {
        const ui = uiKey.trim();
        switch (ui) {
          case NotifyChannel.BANNER_ALERT:
            showBannerAlert({ ...transformToastData(toast, id) });
            break;
          case NotifyChannel.VIKABY_DIALOG:
            isSocialRulePassed && showVikaby({
              defaultExpandDialog: true,
              dialogConfig: { ...transformToastData(toast, id) },
            });
            break;
          case NotifyChannel.WEB_NOTIFICATION:
            requestWebNotification({
              options: { body: toast.content },
              onClick: () => {
                if (!toast.url) {
                  Router.push(Navigation.HOME);
                } else {
                  navigationToConfigUrl(toast.url);
                }
              },
            });
            break;
          default:
            break;
        }
      });
    }
  } catch {
  }
};

export const navigationToConfigUrl = (configUrl: string, option?: {
  clearQuery?: boolean | undefined;
  method?: Method | undefined;
  spaceId?: string | undefined;
  query?: IQuery | undefined;
}) => {
  if (configUrl.startsWith('/')) {
    const url = new URL(configUrl, window.location.origin);
    navigationToUrl(url.href);
  } else {
    navigationToUrl(configUrl);
  }
};

export const PublishControllers = (arr: INoticeDetail[]) => {
  if (!arr.length) return;
  arr.forEach((notify) => {
    PublishController(notify);
  });
};
