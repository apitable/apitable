import { IReduxState } from '@vikadata/core';
import { useMount } from 'ahooks';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { UrlInvalid } from '../components/url_invalid';
import { useInvitePageRefreshed } from '../use_invite';
import { getInvalidReason } from '../utils';

const LinkInvalid: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'linkInvite' });
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);

  useMount(() => {
    whenPageRefreshed();
  });

  if (!inviteLinkInfo) return null;
  const { code, message } = inviteLinkInfo;
  return (
    <UrlInvalid reason={getInvalidReason(code, message)} />
  );
};

export default LinkInvalid;
