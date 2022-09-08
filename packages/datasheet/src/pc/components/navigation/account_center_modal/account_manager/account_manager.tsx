import { BindAccount, ConfigConstant, QrAction, StatusCode, StoreActions, Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { QrCode } from 'pc/components/home/qr_code/qr_code';
import { navigationToUrl } from 'pc/components/route_manager/use_navigation';
import { useRequest, useUserRequest } from 'pc/hooks';
import { getDingdingConfig, getQQConfig } from 'pc/utils/get_config';
import { isDesktop } from 'pc/utils/os';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BindingFeiShuPng from 'static/icon/account/feishu.png';
import DingDingPng from 'static/icon/signin/signin_img_dingding.png';
import QQPng from 'static/icon/signin/signin_img_qq.png';
import WeChatPng from 'static/icon/signin/signin_img_wechat.png';
import { ModeItem } from './mode_item';
import styles from './style.module.less';
import Image from 'next/image';

export const AccountManager: FC = () => {
  // 控制Wechat二维码模态框的显示
  const [wechatVisible, setWechatVisible] = useState(false);
  const userInfo = useSelector(state => state.user.info);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const dispatch = useDispatch();
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });

  useEffect(() => {
    // 清除缓存
    localStorage.removeItem('binding_dingding_status');
    localStorage.removeItem('binding_qq_status');

    const storageChange = (e: StorageEvent) => {
      if (!e.newValue) {
        return;
      }
      if (e.key === 'binding_dingding_status') {
        if (e.newValue === '200') {
          Message.success({ content: t(Strings.binding_success) });
          getLoginStatus();
        } else {
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(e.newValue)) ?
            Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.dingtalk) }) }) :
            Message.error({ content: t(Strings.binding_failure) });
        }
        localStorage.removeItem('binding_dingding_status');
      }
      if (e.key === 'binding_qq_status') {
        if (e.newValue === '200') {
          Message.success({ content: t(Strings.binding_success) });
          getLoginStatus();
        } else {
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(e.newValue)) ?
            Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.qq) }) }) :
            Message.error({ content: t(Strings.binding_failure) });
        }
        localStorage.removeItem('binding_qq_status');
      }
    };

    window.addEventListener('storage', storageChange);
    return () => {
      window.removeEventListener('storage', storageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo?.thirdPartyInformation) {
      setWechatVisible(false);
    }
  }, [userInfo?.thirdPartyInformation]);

  // 解绑第三方账号
  const unbind = (mode: BindAccount) => {
    dispatch(StoreActions.unBindAccount(mode));
  };

  const clickWechat = () => {
    // 解绑操作
    if (userInfo?.thirdPartyInformation.findIndex(item => item.type === BindAccount.WECHAT) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.wechat) }),
        onOk: () => unbind(BindAccount.WECHAT),
        type: 'warning'
      });
    } else {
      // 绑定操作
      setWechatVisible(true);
    }
  };

  const clickDingDing = () => {
    // 解绑操作
    if (userInfo?.thirdPartyInformation.findIndex(item => item.type === BindAccount.DINGDING) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.dingtalk) }),
        onOk: () => unbind(BindAccount.DINGDING),
        type: 'warning'
      });
    } else {
      // 绑定操作
      const { appId, callbackUrl } = getDingdingConfig();
      localStorage.setItem('vika_account_manager_operation_type', String(ConfigConstant.ScanQrType.Binding));
      const url = `https://oapi.dingtalk.com/connect/qrconnect?appid=${appId}&response_type=code&
scope=snsapi_login&state=STATE&redirect_uri=${callbackUrl}`;
      navigationToUrl(url);
    }
  };

  const clickQQ = () => {
    // 解绑操作
    if (userInfo?.thirdPartyInformation.findIndex(item => item.type === BindAccount.QQ) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.qq) }),
        onOk: () => unbind(BindAccount.QQ),
        type: 'warning'
      });
    } else {
      // 绑定操作
      const { appId, callbackUrl } = getQQConfig();
      localStorage.setItem('vika_account_manager_operation_type', String(ConfigConstant.ScanQrType.Binding));
      navigationToUrl(`https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appId}&redirect_uri=${callbackUrl}`);
    }
  };

  const modes = [{
    mod: 'DINGDING',
    name: t(Strings.dingtalk),
    img: DingDingPng,
    onClick: clickDingDing,
    hidden: isDesktop()
  }, {
    mod: 'WECHAT',
    name: t(Strings.wechat),
    img: WeChatPng,
    onClick: clickWechat
  }, {
    mod: 'QQ',
    name: t(Strings.qq),
    img: QQPng,
    onClick: clickQQ,
    hidden: isDesktop()
  }];

  return (
    <div className={styles.accountManagerWrapper}>
      <div className={styles.title}>{t(Strings.account_ass_manage)}</div>
      {(spaceInfo?.social.enabled && spaceInfo?.social.platform === ConfigConstant.SocialType.FEISHU) ?
        <div className={styles.tipWrapper}>
          <Image src={BindingFeiShuPng} alt='binding feishu' width={154} height={48} />
          <div className={styles.tip}>{t(Strings.account_manager_invalid_tip)}</div>
          <div className={styles.subTip}>
            <TComponent
              tkey={t(Strings.account_manager_invalid_subtip)}
              params={{ spaceName: <div className={styles.spaceName}>{userInfo?.spaceName}</div> }}
            />
          </div>
        </div>
        :
        <div className={styles.wrapper}>
          {modes.map((item, index) => {
            if (item.hidden) {
              return <></>;
            }
            const modeInfo = userInfo?.thirdPartyInformation.find(item => item.type === index);
            return (
              <ModeItem
                key={index}
                className={classnames(styles.bottomSpacing, index % 2 === 0 && styles.rightSpacing)}
                img={item.img as any as string}
                name={modeInfo?.nickName ?? ''}
                modeName={t(Strings.binding_account, { mode: item.name })}
                state={Boolean(modeInfo)}
                bindingTime={modeInfo?.createTime ?? ''}
                onClick={item.onClick}
              />
            );
          })}
        </div>
      }
      <QrCode visible={wechatVisible} onClose={() => setWechatVisible(false)} action={QrAction.BIND} />
    </div>
  );
};
