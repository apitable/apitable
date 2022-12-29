import { IReduxState } from '@apitable/core';
import { useMount } from 'ahooks';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { UrlInvalid } from '../components/url_invalid';
import { useInvitePageRefreshed } from '../use_invite';
import { getInvalidReason } from '../utils';

const MailInvalid: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);

  useMount(() => {
    whenPageRefreshed();
  });

  if (!inviteEmailInfo) return null;
  const { code, message } = inviteEmailInfo;
  return (
    <UrlInvalid reason={getInvalidReason(code, message)} />
  );
};

export default MailInvalid;
