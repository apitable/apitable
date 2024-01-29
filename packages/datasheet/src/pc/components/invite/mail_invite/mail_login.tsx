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

import { useMount } from 'ahooks';
import classNames from 'classnames';
import { FC } from 'react';
import { shallowEqual } from 'react-redux';
import { IReduxState, Strings, t } from '@apitable/core';
import { Wrapper } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { PcHome } from 'pc/components/home/pc_home';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { InviteTitle } from '../components';
import { useInvitePageRefreshed } from '../use_invite';
// @ts-ignore
import { LoginWithoutOther } from 'enterprise/home/login/login_without_other';
import styles from './style.module.less';

const MailLogin: FC<React.PropsWithChildren<unknown>> = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const { inviteEmailInfo } = useAppSelector(
    (state: IReduxState) => ({
      inviteEmailInfo: state.invite.inviteEmailInfo,
    }),
    shallowEqual,
  );
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  localStorage.setItem('vika-preference-login-mode', 'mail');

  useMount(() => {
    whenPageRefreshed();
  });

  const { IS_ENTERPRISE } = getEnvVariables();

  return !IS_ENTERPRISE ? (
    <PcHome />
  ) : (
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
          {LoginWithoutOther && (
            <LoginWithoutOther defaultEmail={inviteEmailInfo ? inviteEmailInfo.data.inviteEmail : ''} submitText={t(Strings.login)} />
          )}
        </div>
      </div>
    </Wrapper>
  );
};
export default MailLogin;
