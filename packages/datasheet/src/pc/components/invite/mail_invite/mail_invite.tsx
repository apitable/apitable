import { Api, Navigation, StoreActions } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery, useRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { INVITE_TOKEN_LENGTH } from '../constant';

const MailInvite: FC = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const tokenParams = query.get('inviteToken');
  const mailTokenParams = query.get('inviteMailToken');
  const [inviteMailToken, setInviteMailToken] = useState('');
  const { run: verifyMailUrl } = useRequest(token => Api.inviteEmailVerify(token), {
    onSuccess: res => {
      const { success, data } = res.data;
      dispatch(StoreActions.updateInviteEmailInfo(res.data));
      dispatch(StoreActions.updateMailToken(inviteMailToken));
      if (!success) {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'mail/invalid' },
          query: { inviteMailToken },
        });
        return;
      }
      const { isBound, isLogin, inviteEmail, spaceId } = data;
      if (!isBound) {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'mail/bindphone' },
          query: { inviteMailToken },
        });
        return;
      }
      if (isBound && !isLogin) {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'mail/login' },
          query: { inviteMailToken },
        });
        return;
      }
      if (isBound && isLogin) {
        Api.validateEmail(inviteEmail).then(res => {
          const { success, data } = res.data;
          if (success && data) {
            navigationTo({ path: Navigation.WORKBENCH, params: { spaceId }, clearQuery: true });
            return;
          }
          navigationTo({
            path: Navigation.INVITE,
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
