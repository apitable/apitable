import { Api, Navigation, StoreActions } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery, useRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { INVITE_CODE_LENGTH, INVITE_TOKEN_LENGTH } from '../constant';

const removeChinese = (params: string | null, length: number) => {
  return params?.substring(0, length);
};

const LinkInvite: FC = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const tokenParams = query.get('token');
  const linkTokenParams = query.get('inviteLinkToken');
  const inviteCode = removeChinese(query.get('inviteCode'), INVITE_CODE_LENGTH);

  const [inviteLinkToken, setInviteLinkToken] = useState('');
  const { run: verifyLinkUrl } = useRequest(token => Api.linkValid(token), {
    onSuccess: res => {
      const { success, code, data } = res.data;
      dispatch(StoreActions.updateInviteLinkInfo(res.data));
      dispatch(StoreActions.updateLinkToken(inviteLinkToken));
      if (!success && code != 201) {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'link/invalid' },
          query: { inviteLinkToken, inviteCode },
        });
        return;
      }
      if (data.isExist) {
        const spaceId = data.spaceId;
        navigationTo({ path: Navigation.WORKBENCH, params: { spaceId }, clearQuery: true });
      }
      if (!data.isExist) {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'link/confirm' },
          query: { inviteLinkToken, inviteCode },
        });
      }
    },
    manual: true,
  });

  useMount(() => {
    const finalTokenParams = tokenParams || linkTokenParams;
    if (!finalTokenParams) {
      return;
    }
    const token = removeChinese(finalTokenParams, INVITE_TOKEN_LENGTH);
    if (token) {
      setInviteLinkToken(token);
      verifyLinkUrl(token);
    }
  });

  return <Loading />;
};

export default LinkInvite;
