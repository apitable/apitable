import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Api, BindAccount, ConfigConstant, IReduxState, Navigation, QrAction, StatusCode, Strings, t } from '@apitable/core';
import { Spin } from 'antd';
import Image from 'next/image';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import { useLinkInvite, useRequest, useUserRequest } from 'pc/hooks';
import { getSearchParams, isLocalSite } from 'pc/utils';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';

export interface IQrCode {
  visible: boolean;
  onClose: () => void;
  type?: BindAccount;
  action: QrAction;
  afterLogin?(data: string, loginMode: ConfigConstant.LoginMode): void;
}

const TIME_LIMIT = 60000 * 10;

export const QrCode: React.FC<IQrCode> = ({ visible, type = BindAccount.WECHAT, onClose, action, afterLogin }) => {
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });
  const { join } = useLinkInvite();
  const [isTimeOut, setIsTimeOut] = useState(false); // 是否超时 ，10min
  const [qrCode, setQrCode] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference') || undefined;
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const globalRef = useRef<{
    timer: null | number,
    limit: number,
  }>({
    timer: null,
    limit: TIME_LIMIT,
  });

  function rePoll() {
    setIsTimeOut(false);
    globalRef.current.limit = TIME_LIMIT;
    loginForWechat();
  }

  useEffect(() => {
    if (!(visible && isTimeOut)) return;
    rePoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function resetInterval() {
    clearInterval(globalRef.current.timer as number);
    globalRef.current.timer = null;
    setIsTimeOut(true);
  }

  function poll(mark: string) {
    if (globalRef.current.limit < 0) {
      resetInterval();
    }
    globalRef.current.limit -= 2000;
    // 非链接邀请微信登录页面
    Api.officialAccountsPoll(mark, action).then(async res => {
      const { success, data, code } = res.data;
      if (success) {
        onClose();
        await getLoginStatus();
        resetInterval();
        if (afterLogin) {
          // share 页面的扫码登录
          afterLogin(data, ConfigConstant.LoginMode.OTHER);
          return;
        }
        if (action === QrAction.BIND && type === BindAccount.WECHAT) {
          // 微信绑定
          Message.success({ content: t(Strings.binding_success) });
          return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const isFromLinkInvite = urlParams.has('inviteLinkToken');
        // 链接邀请
        if (isFromLinkInvite && data) {
          Router.redirect(Navigation.IMPROVING_INFO, {
            query: {
              token: data,
              inviteLinkToken: urlParams.get('inviteLinkToken') || undefined,
              inviteCode: inviteLinkInfo?.data.inviteCode,
            },
          });
          return;
        }
        if (isFromLinkInvite && !data) {
          join();
          return;
        }
        // 正常登录注册流程
        if (data) {
          Router.redirect(Navigation.IMPROVING_INFO, {
            query: { token: data, inviteCode: urlParams.get('inviteCode') || undefined, reference },
          });
        } else {
          // 如果有源URL地址，就跳转到源地址
          if (reference && isLocalSite(window.location.href, reference)) {
            window.location.href = reference;
            return;
          }
          Router.redirect(Navigation.HOME,);
        }
      } else {
        if (action === QrAction.BIND && type === BindAccount.WECHAT) {
          // 微信绑定
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(code)) &&
          Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.wechat) }) });
          return;
        }
      }
    });
  }

  async function loginForWechat() {
    const res = await Api.getOfficialAccountsQrCode(action);
    const { success, data } = res.data;
    if (success) {
      setQrCode(data.image);
      globalRef.current.timer = window.setInterval(() => {
        poll(data.mark);
      }, 2000);
    }

  }

  useEffect(() => {
    if (visible) {
      loginForWechat();
    }
    const ref = globalRef.current;
    if (!visible && ref.timer !== null) {
      clearInterval(ref.timer);
      ref.timer = null;
    }
    return () => {
      if (ref.timer !== null) {
        clearInterval(ref.timer);
        ref.timer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function renderFooter() {
    if (action === QrAction.LOGIN) {
      if (type === BindAccount.WECHAT) {
        return t(Strings.wechat_bind);
      }
      if (type === BindAccount.DINGDING) {
        return t(Strings.dingding_bind);
      }
    }
    if (action === QrAction.BIND) {
      if (type === BindAccount.WECHAT) {
        return t(Strings.wechat_bind);
      }
      if (type === BindAccount.DINGDING) {
        return t(Strings.dingding_bind);
      }
    }
    return '';
  }

  const loading = <LoadingOutlined spin />;

  return (
    <Modal
      className={styles.qrCodeModal}
      title={
        <div className={styles.modalTitle}>
          {t(Strings.quick_login_bind, { type: action === QrAction.LOGIN ? t(Strings.login) : t(Strings.bind) })}
        </div>
      }
      visible={visible}
      footer={null}
      centered
      destroyOnClose
      // closeIcon={<CommonBtn.CloseBtn />}
      width='320px'
      maskClosable
      onCancel={onClose}
    >
      <div className={styles.codeWrapper}>
        {
          isTimeOut ? (
            <div className={styles.freshMask} onClick={rePoll}>
              <p>{t(Strings.QR_code_invalid)}</p>
              <p>{t(Strings.click_refresh)}</p>
            </div>
          ) : <div />
        }
        <div className={styles.codeImageContainer}>
          {qrCode ? <span className={styles.codeImage}><Image src={qrCode} alt='' width={210} height={210} /> </span> : <Spin indicator={loading} />}
        </div>
        <div className={styles.tip}>{renderFooter()}</div>
      </div>
    </Modal>
  );
};

interface IQRCodeBase {
  type?: BindAccount;
  action: QrAction;
  afterLogin?(data: string, loginMode: ConfigConstant.LoginMode): void;
}

// 不需要Modal，直接作为组件渲染的QRCode
export const QRCodeBase = ({
  type,
  action,
  afterLogin,
}: IQRCodeBase): JSX.Element => {
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest(getLoginStatusReq, { manual: true });
  const { join } = useLinkInvite();
  const [isTimeOut, setIsTimeOut] = useState(false); // 是否超时 ，10min
  const [qrCode, setQrCode] = useState('');
  const urlParams = getSearchParams();
  const reference = urlParams.get('reference') || undefined;
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const globalRef = useRef<{
    timer: null | number,
    limit: number,
  }>({
    timer: null,
    limit: TIME_LIMIT,
  });

  function rePoll() {
    setIsTimeOut(false);
    globalRef.current.limit = TIME_LIMIT;
    loginForWechat();
  }

  function resetInterval() {
    clearInterval(globalRef.current.timer as number);
    globalRef.current.timer = null;
    setIsTimeOut(true);
  }

  function poll(mark: string) {
    if (globalRef.current.limit < 0) {
      resetInterval();
    }
    globalRef.current.limit -= 2000;
    // 非链接邀请微信登录页面
    Api.officialAccountsPoll(mark, action).then(async res => {
      const { success, data, code } = res.data;
      if (success) {
        await getLoginStatus();
        resetInterval();
        if (afterLogin) {
          // share 页面的扫码登录
          afterLogin(data, ConfigConstant.LoginMode.OTHER);
          return;
        }
        if (action === QrAction.BIND && type === BindAccount.WECHAT) {
          // 微信绑定
          Message.success({ content: t(Strings.binding_success) });
          return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const isFromLinkInvite = urlParams.has('inviteLinkToken');
        // 链接邀请
        if (isFromLinkInvite && data) {
          Router.redirect(Navigation.IMPROVING_INFO, {
            query: {
              token: data,
              inviteLinkToken: urlParams.get('inviteLinkToken') || undefined,
              inviteCode: inviteLinkInfo?.data.inviteCode,
            },
          });
          return;
        }
        if (isFromLinkInvite && !data) {
          join();
          return;
        }
        // 正常登录注册流程
        if (data) {
          Router.redirect(Navigation.IMPROVING_INFO, {
            query: { token: data, inviteCode: urlParams.get('inviteCode') || undefined, reference },
          });
        } else {
          // 如果有源URL地址，就跳转到源地址
          if (reference && isLocalSite(window.location.href, reference)) {
            window.location.href = reference;
            return;
          }
          Router.redirect(Navigation.HOME,);
        }
      } else {
        if (action === QrAction.BIND && type === BindAccount.WECHAT) {
          // 微信绑定
          StatusCode.BINDING_ACCOUNT_ERR.includes(Number(code)) &&
          Message.error({ content: t(Strings.binding_account_failure_tip, { mode: t(Strings.wechat) }) });
          return;
        }
      }
    });
  }

  async function loginForWechat() {
    const res = await Api.getOfficialAccountsQrCode(action);
    const { success, data } = res.data;
    if (success) {
      setQrCode(data.image);
      globalRef.current.timer = window.setInterval(() => {
        poll(data.mark);
      }, 2000);
    }

  }

  const loading = <LoadingOutlined spin />;

  useEffect(() => {
    loginForWechat();

    const ref = globalRef.current;
    if (ref.timer !== null) {
      clearInterval(ref.timer);
      ref.timer = null;
    }
    return () => {
      if (ref.timer !== null) {
        clearInterval(ref.timer);
        ref.timer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.codeWrapper}>
      {
        isTimeOut ? (
          <div className={styles.freshMask} onClick={rePoll} style={{ margin: 0 }}>
            <p>{t(Strings.QR_code_invalid)}</p>
            <p>{t(Strings.click_refresh)}</p>
          </div>
        ) : <></>
      }
      <div className={styles.codeImageContainer} style={{ border: 'none' }}>
        {qrCode ? <span className={styles.codeImage}><Image src={qrCode} alt='' width={210} height={210} /></span> : <Spin indicator={loading} />}
      </div>
    </div>
  );
};
