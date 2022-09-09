import { IReduxState, Strings, t } from '@vikadata/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import { Wrapper } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { LoginWithoutOther } from 'pc/components/home/login';
import { useResponsive } from 'pc/hooks';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { InviteTitle } from '../components';
import { useInvitePageRefreshed } from '../use_invite';
import styles from './style.module.less';

const MailLogin: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const { inviteEmailInfo } = useSelector(
    (state: IReduxState) => ({
      inviteEmailInfo: state.invite.inviteEmailInfo,
    }),
    shallowEqual,
  );
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMount(() => {
    whenPageRefreshed();
  });

  useMount(() => {
    // 切换为邮箱登录
    localStorage.setItem('vika-preference-login-mode', 'mail');
  });

  return (
    <Wrapper>
      <div className={classNames('invite-children-center', styles.linkInviteLogin)}>
        {inviteEmailInfo && (
          <InviteTitle
            inviter={inviteEmailInfo.data.inviter}
            spaceName={inviteEmailInfo.data.spaceName}
            desc={t(Strings.login_with_qq_or_phone_for_invited_email, {
              inviteEmail: inviteEmailInfo.data.inviteEmail,
            })}
            titleMarginBottom={isMobile ? '16px' : '40px'}
            subTitleMarginBottom={isMobile ? '24px' : '0'}
          />
        )}
        <div className={styles.loginContent}>
          <LoginWithoutOther defaultEmail={inviteEmailInfo ? inviteEmailInfo.data.inviteEmail : ''} submitText={t(Strings.login)} />
        </div>
      </div>
    </Wrapper>
  );
};
export default MailLogin;
