import { Button } from '@apitable/components';
import { IReduxState, Navigation, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useInvitePageRefreshed } from '../use_invite';
import styles from './style.module.less';

const MailMismatch: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);

  useMount(() => {
    whenPageRefreshed();
  });

  const toLogin = () => {
    Router.push(Navigation.HOME);
  };

  if (!inviteEmailInfo) return null;
  const tipText = t(Strings.not_mail_invitee_page_tip, { text: inviteEmailInfo!.data.inviteEmail });
  return (
    <Wrapper>
      <div className={classNames('invite-children-center', styles.mismatch)}>
        <h1>{parser(tipText)}</h1>
        <Button
          onClick={toLogin}
          style={{ width: '240px', marginTop: '22px' }}
          color='primary'
          block
        >
          {t(Strings.back_to_space)}
        </Button>
      </div>
    </Wrapper>
  );
};
export default MailMismatch;
