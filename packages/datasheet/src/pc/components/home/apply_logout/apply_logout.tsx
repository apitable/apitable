import { Button, colorVars, Typography } from '@apitable/components';
import { Api, integrateCdnHost, IReduxState, isPrivateDeployment, Navigation, Settings, StoreActions, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Space } from 'antd';
import Image from 'next/image';
import { StatusIconFunc } from 'pc/components/common/icon';
import { Loading } from 'pc/components/common/loading';
import { Logo } from 'pc/components/common/logo';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { useDispatch, useUserRequest } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';

const ApplyLogout: FC = () => {
  const user = useSelector((state: IReduxState) => state.user);
  const userInfo = user.info || window.__initialization_data__.userInfo;
  const dispatch = useDispatch();
  const { signOutReq } = useUserRequest();

  const [loading, setLoading] = useState(true);

  useMount(() => {
    setLoading(true);
    Api.getUserMe({}).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        dispatch(StoreActions.setUserMe(data));
        const { isPaused } = data;
        if (!isPaused) {
          Router.push(Navigation.HOME);
        }
      } else {
        Message.error({
          content: message
        });
        Router.push(Navigation.LOGIN);
      }
    }).finally(() => {
      setLoading(false);
    });
  });

  const revokeLogout = () => {
    Api.revokeLogout().then(res => {
      const { message, success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.cancelled_log_out_succeed) });
        Router.push(Navigation.HOME);
      } else {
        Message.error({ content: message });
      }
    });
  };

  const { LOGIN_OFFICIAL_WEBSITE_URL } = getEnvVariables();

  const jumpOfficialWebsite = () => {
    if (LOGIN_OFFICIAL_WEBSITE_URL) {
      window.open(LOGIN_OFFICIAL_WEBSITE_URL, '__blank');
      return;
    }
    Router.newTab(Navigation.HOME, { query: { home: 1 }});
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo} onClick={jumpOfficialWebsite}>
        {isPrivateDeployment() ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/common_img_logo.png`}
            alt='vika_logo'
            className={styles.logoPng}
            onClick={jumpOfficialWebsite}
            style={{
              height: 36
            }}
          />
        ) :
          (
            <span
              className={styles.logoPng}>
              <Logo size='large' />
            </span>
          )
        }
        <div className={styles.logoSlogan}>{t(Strings.login_logo_slogan)}</div>
      </div>

      <div
        className={styles.content}
        style={{
          backgroundImage: `url(${integrateCdnHost(Settings.user_account_deleted_bg_img.value)})`,
          backgroundSize: 'cover'
        }}
      >
        <Space
          size={24}
          direction='vertical'
          align='center'
        >
          <Image
            width={240}
            height={180}
            src={integrateCdnHost(Settings.user_account_deleted_img.value)}
          />
          <Typography variant='h6'>
            {t(Strings.we_already_received_your_apply)}
          </Typography>
          <Typography variant='h7' style={{ fontWeight: 'normal' }}>
            <TComponent
              tkey={t(Strings.your_account_will_destroy_at)}
              params={{
                time: (
                  <span
                    style={{ color: colorVars.fc10, fontWeight: 'bold' }}
                  >
                    {userInfo?.closeAt || 'error'}
                  </span>
                )
              }}
            />
          </Typography>
          <Space
            direction='vertical'
            style={{
              width: 160
            }}
          >
            <Button
              color='primary'
              block
              onClick={() => {
                Modal.confirm({
                  title: t(Strings.revoke_logout),
                  content: t(Strings.modal_content_confirm_revoke_logout),
                  onOk: () => {
                    revokeLogout();
                  },
                  okButtonProps: {
                    color: 'warning'
                  },
                  icon: <div className={styles.statusIcon}><StatusIconFunc type='warning' /></div>
                });
              }}
            >
              {t(Strings.revoke_logout)}
            </Button>
            <Button
              block
              variant='fill'
              onClick={() => {
                signOutReq();
              }}
            >
              {t(Strings.logout)}
            </Button>
          </Space>

        </Space>
      </div>
    </div>
  );
};

export default ApplyLogout;
