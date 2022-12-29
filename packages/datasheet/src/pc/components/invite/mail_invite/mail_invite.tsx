import { Api, Navigation, StoreActions } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { INVITE_TOKEN_LENGTH } from '../constant';

const MailInvite: FC = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const tokenParams = query.get('inviteToken');
  const mailTokenParams = query.get('inviteMailToken');
  const [inviteMailToken, setInviteMailToken] = useState('');
  const { run: verifyMailUrl } = useRequest(token => Api.inviteEmailVerify(token), {
    onSuccess: res => {
      const { success, data } = res.data;
      dispatch(StoreActions.updateInviteEmailInfo(res.data));
      dispatch(StoreActions.updateMailToken(inviteMailToken));
      if (!success) {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'mail/invalid' },
          query: { inviteMailToken },
        });
        return;
      }
      const { isBound, isLogin, inviteEmail, spaceId } = data;
      if (!isBound) {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'mail/bindphone' },
          query: { inviteMailToken },
        });
        return;
      }
      if (isBound && !isLogin) {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'mail/login' },
          query: { inviteMailToken },
        });
        return;
      }
      if (isBound && isLogin) {
        Api.validateEmail(inviteEmail).then(res => {
          const { success, data } = res.data;
          if (success && data) {
            Router.push(Navigation.WORKBENCH, { params: { spaceId }, clearQuery: true });
            return;
          }
          Router.push(Navigation.INVITE, {
            params: { invitePath: 'mail/mismatch' },
            query: { inviteMailToken },
          });
          return;
        });
      }
    },
    manual: true,
  });

  useMount(() => {
    const finalTokenParams = tokenParams || mailTokenParams;
    const token = finalTokenParams?.substring(0, INVITE_TOKEN_LENGTH);
    if (token) {
      setInviteMailToken(token);
      verifyMailUrl(token);
    }
  });
  return <Loading />;
};

export default MailInvite;
