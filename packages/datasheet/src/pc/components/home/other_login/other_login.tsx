import { IconButton } from '@vikadata/components';
import { BindAccount, ConfigConstant, IReduxState, QrAction, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import Image from 'next/image';
import { Modal } from 'pc/components/common';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useQuery } from 'pc/hooks';
import { store } from 'pc/store';
import { getDingdingConfig, getFeishuConfig, getQQConfig, getWechatConfig, getWecomConfig, getWecomShopConfig } from 'pc/utils/get_config';
import { isDesktop } from 'pc/utils/os';
import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import DingdingIcon from 'static/icon/signin/signin_img_dingding.png';
import LarkIcon from 'static/icon/signin/signin_img_feishu.png';
import QQIcon from 'static/icon/signin/signin_img_qq.png';
import WechatIcon from 'static/icon/signin/signin_img_wechat.png';
import WecomIcon from 'static/icon/signin/signin_img_wecom.png';
import { DingdingQrCode } from '../dingding_qr_code';
import { QrCode } from '../qr_code/qr_code';
import { isWecomFunc } from '../social_platform';
import { WecomQrCode } from '../wecom_qr_code';
import styles from './style.module.less';

export const OtherLogin: FC<{ afterLogin?(data: string, loginMode: ConfigConstant.LoginMode): void }> = props => {
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteLinkToken = useSelector((state: IReduxState) => state.invite.linkToken);
  const query = useQuery();
  const reference = query.get('reference');
  const isInvitePage = window.location.pathname.startsWith('/invite');
  const isWecomDomain = useSelector(state => state.space.envs?.weComEnv?.enabled);
  useMount(() => {
    localStorage.removeItem('share_login_reference');
    localStorage.removeItem('invite_link_data');
    localStorage.removeItem('invite_code');
  });

  const settingReference = () => {
    if (!window.location.pathname.startsWith('/login') && !isInvitePage) {
      localStorage.setItem('reference', window.location.href);
      return;
    }
    if (window.location.pathname.startsWith('/login') && reference) {
      localStorage.setItem('reference', reference);
    }
  };

  const settingInviteData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromLinkInvite = urlParams.has('inviteLinkToken');
    if (isFromLinkInvite && inviteLinkToken && inviteLinkInfo) {
      const info = {
        inviteLinkInfo,
        linkToken: inviteLinkToken,
        inviteCode: urlParams.get('inviteCode'),
      };
      localStorage.setItem('invite_link_data', JSON.stringify(info));
    }
    const inviteCode = urlParams.get('inviteCode');
    if (inviteCode) {
      localStorage.setItem('invite_code', inviteCode);
    }
  };

  const listData = [{
    id: 'wecom_login_btn',
    img: WecomIcon,
    name: t(Strings.wecom),
    hidden: !isWecomDomain || !isMobile,
    onClick: () => {
      settingReference();
      wecomLogin();
    },
  }, {
    id: 'wecom_shop_login_btn',
    img: WecomIcon,
    name: t(Strings.wecom),
    hidden: isDesktop(),
    onClick: () => {
      settingReference();
      isWecomFunc() ? wecomQuickLogin('snsapi_base', reference) : wecomShopLogin();
    },
  }, {
    id: 'wechat_login_btn',
    img: WechatIcon,
    name: t(Strings.wechat),
    onClick: () => {
      settingReference();
      wechatLogin({ afterLogin: props.afterLogin });
    },
  }, {
    id: 'dingding_login_btn',
    img: DingdingIcon,
    name: t(Strings.dingtalk),
    onClick: () => {
      settingReference();
      settingInviteData();
      dingdingLogin();
    },
    hidden: isDesktop(),
  }, {
    id: 'feishu_login_btn',
    img: LarkIcon,
    name: t(Strings.lark),
    hidden: isDesktop() || isInvitePage,
    onClick: () => {
      settingReference();
      feishuLogin();
    },
  },
  {
    id: 'qq_login_btn',
    img: QQIcon,
    name: t(Strings.qq),
    hidden: isDesktop(),
    onClick: () => {
      settingReference();
      settingInviteData();
      qqLogin();
    },
  }];

  return (
    <div className={styles.otherLoginWrapper}>
      {
        listData.map(item => {
          if (item.hidden) {
            return <></>;
          }
          const obj = {
            id: item.id,
            key: item.name,
            onClick: item.onClick,
            'data-sensors-click': true,
            className: styles.btn,
          };
          return (
            <div {...obj}>
              <Image src={item.img} alt={item.name} />
            </div>
          );
        })
      }
    </div>
  );
};

// 微信登录
export const wechatLogin = (
  option: { afterLogin?: (data: string, loginMode: ConfigConstant.LoginMode) => void, type?: BindAccount } = { type: BindAccount.WECHAT },
) => {
  const { afterLogin, type } = option;
  // 如果是微信浏览器则进行免密登录（区分企业微信）
  if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLowerCase().indexOf('wxwork') === -1) {
    const { appId, callbackUrl } = getWechatConfig();
    // eslint-disable-next-line max-len
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${callbackUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    return;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
  };

  root.render(
    <Provider store={store}>
      <QrCode
        visible
        onClose={close}
        type={type}
        action={QrAction.LOGIN}
        afterLogin={afterLogin}
      />
    </Provider>);
};

// 钉钉登录
export const dingdingLogin = () => {
  // 如果是在钉钉内打开，则进行免密登录
  if (navigator.userAgent.indexOf('DingTalk') > -1) {
    const { appId, callbackUrl } = getDingdingConfig();
    // eslint-disable-next-line max-len
    window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_auth&state=STATE&redirect_uri=${callbackUrl}`;
    return;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
  };

  root.render(
    <Provider store={store}>
      <Modal
        title={
          <div className={styles.modalTitle}>
            {t(Strings.quick_login_bind, { type: t(Strings.login) })}
          </div>
        }
        visible
        footer={null}
        centered
        destroyOnClose
        closeIcon={<IconButton icon={() => <CloseIcon />} />}
        width='320px'
        maskClosable
        onCancel={() => close()}
        className={styles.dingdingCodeModal}
      >
        <DingdingQrCode />
      </Modal>
    </Provider>);
};

export const feishuLogin = () => {
  const { pathname, appId } = getFeishuConfig();
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams('');
  urlParams.append('app_id', appId);
  url.search = urlParams.toString();
  url.pathname = pathname;
  window.location.href = url.href;
};

export const qqLogin = () => {
  const { appId, callbackUrl } = getQQConfig();
  if (isMobile) {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appId}&redirect_uri=${callbackUrl}`;
  } else {
    navigationToUrl(`https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appId}&redirect_uri=${callbackUrl}`);
  }
};

// 企业微信专属域名/自建应用登录
export const wecomLogin = (reference?: string) => {
  const state = store.getState();
  const wecomEnv = state.space.envs.weComEnv!;
  const searchParams = new URLSearchParams(window.location.search);
  const corpId = searchParams.get('corpId') || wecomEnv.corpId;
  const agentId = searchParams.get('agentId') || wecomEnv.agentId;
  const pipeline = searchParams.get('pipeline');
  if (navigator.userAgent.indexOf('wxwork') > -1) {
    const { callbackUrl } = getWecomConfig();
    const url = new URL(callbackUrl);
    corpId && url.searchParams.set('corpId', corpId);
    agentId && url.searchParams.set('agentId', agentId);
    reference && url.searchParams.set('reference', reference);
    // 兼容一下pipeline，为了调试
    pipeline && url.searchParams.set('pipeline', pipeline);
    // eslint-disable-next-line max-len
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${encodeURIComponent(url.href)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    return;
  }
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
  };

  root.render(
    <Provider store={store}>
      <Modal
        title={
          <div className={styles.modalTitle}>
            {t(Strings.quick_login_bind, { type: t(Strings.login) })}
          </div>
        }
        visible
        footer={null}
        centered
        destroyOnClose
        width='320px'
        maskClosable
        onCancel={() => close()}
        closeIcon={<IconButton icon={() => <CloseIcon />} />}
        className={styles.dingdingCodeModal}
      >
        <WecomQrCode />
      </Modal>
    </Provider>);
};

/**
 * snsapi_base: 静默授权，可获取成员的基础信息（UserId与DeviceId）
 * snsapi_userinfo: 静默授权，可获取成员的详细信息，但不包含头像、二维码等敏感信息
 * snsapi_privateinfo: 手动授权，可获取成员的详细信息，包含头像、二维码等敏感信息
 */
type ScopeType = 'snsapi_base' | 'snsapi_userinfo' | 'snsapi_privateinfo';

/**
 * 企业微信集成第三方应用快速登录
 * @param reference 登录成功重定向地址
 */
export const wecomQuickLogin = (scopeType: ScopeType, reference?: string | null) => {
  const { callbackUrl, suiteId } = getWecomShopConfig();
  const authUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  const redirectUrl = new URL(decodeURIComponent(callbackUrl));
  redirectUrl.searchParams.set('suiteid', suiteId);
  reference && redirectUrl.searchParams.set('reference', reference);
  localStorage.removeItem('wecomShopLoginType');
  reference && localStorage.setItem('wecomShopLoginToReference', reference);
  // eslint-disable-next-line max-len
  window.location.href = `${authUrl}?appid=${suiteId}&redirect_uri=${encodeURIComponent(redirectUrl.href)}&response_type=code&scope=${scopeType}&state=${suiteId}#wechat_redirect`;
};
// 企业微信商店应用
export const wecomShopLogin = () => {
  const { corpId, callbackUrl } = getWecomShopConfig();
  const url = 'https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect';
  const redirectUrl = callbackUrl;
  const state = 'vikalogin@camera';
  localStorage.setItem('wecomShopLoginType', ConfigConstant.AuthReference.CAMERA);
  window.location.href = `${url}?appid=${corpId}&redirect_uri=${redirectUrl}&state=${state}&usertype=member`;
};
