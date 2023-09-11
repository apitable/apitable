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
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api, Navigation, StoreActions } from '@apitable/core';
import { Loading } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { INVITE_CODE_LENGTH, INVITE_TOKEN_LENGTH } from '../constant';

const removeChinese = (params: string | null, length: number) => {
  return params?.substring(0, length);
};

const LinkInvite: FC<React.PropsWithChildren<unknown>> = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const tokenParams = query.get('token');
  const linkTokenParams = query.get('inviteLinkToken');
  const inviteCode = removeChinese(query.get('inviteCode'), INVITE_CODE_LENGTH);
  const nodeId = query.get('nodeId') as string;

  const [inviteLinkToken, setInviteLinkToken] = useState('');
  const { run: verifyLinkUrl } = useRequest((token, nodeId) => Api.linkValid(token, nodeId), {
    onSuccess: (res) => {
      const { success, code, data } = res.data;
      dispatch(StoreActions.updateInviteLinkInfo(res.data));
      dispatch(StoreActions.updateLinkToken(inviteLinkToken));
      if (!success && code != 201) {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'link/invalid' },
          query: { inviteLinkToken, inviteCode },
        });
        return;
      }
      if (data.isExist) {
        const spaceId = data.spaceId;
        Router.push(Navigation.WORKBENCH, { params: { spaceId }, clearQuery: true });
      }
      if (!data.isExist) {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'link/confirm' },
          query: { inviteLinkToken, inviteCode, nodeId },
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
      verifyLinkUrl(token, nodeId);
    }
  });

  return <Loading />;
};

export default LinkInvite;
