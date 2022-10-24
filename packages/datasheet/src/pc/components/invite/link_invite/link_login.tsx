import { IReduxState } from '@apitable/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';

import { Wrapper } from 'pc/components/common';
import { LoginToggle } from 'pc/components/home/login_toggle';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { InviteTitle } from '../components';

import { useInvitePageRefreshed } from '../use_invite';

// import '../invite.common.less';
import styles from './style.module.less';

const LinkLogin: FC = () => {
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
          <LoginToggle />
        </div>
      </div>
    </Wrapper>
  );
};

export default LinkLogin;
