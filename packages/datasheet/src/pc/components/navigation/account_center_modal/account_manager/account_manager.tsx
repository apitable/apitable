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

import classnames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { BindAccount, ConfigConstant, QrAction, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useRequest } from 'pc/hooks/use_request';
import { useUserRequest } from 'pc/hooks/use_user_request';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { isDesktop } from 'pc/utils/os';
import BindingFeiShuPng from 'static/icon/account/feishu.png';
import DingDingPng from 'static/icon/signin/signin_img_dingding.png';
import QQPng from 'static/icon/signin/signin_img_qq.png';
import WeChatPng from 'static/icon/signin/signin_img_wechat.png';
import { ModeItem } from './mode_item';
// @ts-ignore
import { QrCode } from 'enterprise/home/qr_code/qr_code';
// @ts-ignore
import { Trial } from 'enterprise/log/trial';
// @ts-ignore
import { getDingdingConfig, getQQConfig } from 'enterprise/login/utils/get_config';
import styles from './style.module.less';

export const AccountManager: FC<React.PropsWithChildren<unknown>> = () => {
  // Control the display of the Wechat QR code modal box
  const [wechatVisible, setWechatVisible] = useState(false);
  const userInfo = useAppSelector((state) => state.user.info);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const dispatch = useAppDispatch();
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });
  const vars = getEnvVariables();
  const [showTrialModal, setShowTrialModal] = useState<boolean>(vars.CLOUD_DISABLE_ACCOUNT_MANAGEMENT);

  useEffect(() => {
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
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(e.newValue))
            ? Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.dingtalk) }) })
            : Message.error({ content: t(Strings.binding_failure) });
        }
        localStorage.removeItem('binding_dingding_status');
      }
      if (e.key === 'binding_qq_status') {
        if (e.newValue === '200') {
          Message.success({ content: t(Strings.binding_success) });
          getLoginStatus();
        } else {
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(e.newValue))
            ? Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.qq) }) })
            : Message.error({ content: t(Strings.binding_failure) });
        }
        localStorage.removeItem('binding_qq_status');
      }
    };

    window.addEventListener('storage', storageChange);
    return () => {
      window.removeEventListener('storage', storageChange);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userInfo?.thirdPartyInformation) {
      setWechatVisible(false);
    }
  }, [userInfo?.thirdPartyInformation]);

  if (showTrialModal) {
    return Trial && <Trial setShowTrialModal={setShowTrialModal} title={t(Strings.account_ass_manage)} />;
  }

  // Unbind third-party accounts
  const unbind = (mode: BindAccount) => {
    dispatch(StoreActions.unBindAccount(mode));
  };

  const clickWechat = () => {
    if (userInfo?.thirdPartyInformation.findIndex((item) => item.type === BindAccount.WECHAT) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.wechat) }),
        onOk: () => unbind(BindAccount.WECHAT),
        type: 'warning',
      });
    } else {
      setWechatVisible(true);
    }
  };

  const clickDingDing = () => {
    if (userInfo?.thirdPartyInformation.findIndex((item) => item.type === BindAccount.DINGDING) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.dingtalk) }),
        onOk: () => unbind(BindAccount.DINGDING),
        type: 'warning',
      });
    } else {
      const { appId, callbackUrl } = getDingdingConfig?.() || {};
      localStorage.setItem('vika_account_manager_operation_type', String(ConfigConstant.ScanQrType.Binding));
      const url = `https://oapi.dingtalk.com/connect/qrconnect?appid=${appId}&response_type=code&
scope=snsapi_login&state=STATE&redirect_uri=${callbackUrl}`;
      navigationToUrl(url);
    }
  };

  const clickQQ = () => {
    if (userInfo?.thirdPartyInformation.findIndex((item) => item.type === BindAccount.QQ) !== -1) {
      Modal.confirm({
        title: t(Strings.confirm_unbind),
        content: t(Strings.unbind_third_party_accounts_desc, { mode: t(Strings.qq) }),
        onOk: () => unbind(BindAccount.QQ),
        type: 'warning',
      });
    } else {
      const { appId, callbackUrl } = getQQConfig?.() || {};
      localStorage.setItem('vika_account_manager_operation_type', String(ConfigConstant.ScanQrType.Binding));
      navigationToUrl(`https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appId}&redirect_uri=${callbackUrl}`);
    }
  };

  const modes = [
    {
      mod: 'DINGDING',
      name: t(Strings.dingtalk),
      img: DingDingPng,
      onClick: clickDingDing,
      hidden: isDesktop() || getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE,
    },
    {
      mod: 'WECHAT',
      name: t(Strings.wechat),
      img: WeChatPng,
      onClick: clickWechat,
      hidden: getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE,
    },
    {
      mod: 'QQ',
      name: t(Strings.qq),
      img: QQPng,
      onClick: clickQQ,
      hidden: isDesktop() || getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE,
    },
  ];

  return (
    <div className={styles.accountManagerWrapper}>
      <div className={styles.title}>{t(Strings.account_ass_manage)}</div>
      {spaceInfo?.social.enabled && spaceInfo?.social.platform === ConfigConstant.SocialType.FEISHU ? (
        <div className={styles.tipWrapper}>
          <Image src={BindingFeiShuPng} alt="binding feishu" width={154} height={48} />
          <div className={styles.tip}>{t(Strings.account_manager_invalid_tip)}</div>
          <div className={styles.subTip}>
            <TComponent
              tkey={t(Strings.account_manager_invalid_subtip)}
              params={{ spaceName: <div className={styles.spaceName}>{userInfo?.spaceName}</div> }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          {modes.map((item, index) => {
            if (item.hidden) {
              return <></>;
            }
            const modeInfo = userInfo?.thirdPartyInformation.find((item) => item.type === index);
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
      )}
      {QrCode && <QrCode visible={wechatVisible} onClose={() => setWechatVisible(false)} action={QrAction.BIND} />}
    </div>
  );
};
