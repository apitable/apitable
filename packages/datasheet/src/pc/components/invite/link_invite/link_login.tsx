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

import { IReduxState } from '@apitable/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';

import { Wrapper } from 'pc/components/common';
// @ts-ignore
import { LoginToggle } from 'enterprise';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { InviteTitle } from '../components';

import { useInvitePageRefreshed } from '../use_invite';

// import '../invite.common.less';
import styles from './style.module.less';

const LinkLogin: FC<React.PropsWithChildren<unknown>> = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'linkInvite' });
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  useMount(() => {
    whenPageRefreshed();
  });

  if (!inviteLinkInfo) return null;
  return (
    <Wrapper>
      <div className={classNames(styles.linkLogin, 'invite-children-center')}>
        {
          <InviteTitle
            inviter={inviteLinkInfo.data.memberName}
            spaceName={inviteLinkInfo.data.spaceName}
            titleMarginBottom="40px"
          />
        }
        <div className={styles.loginContent}>
          {LoginToggle && <LoginToggle />}
        </div>
      </div>
    </Wrapper>
  );
};

export default LinkLogin;
