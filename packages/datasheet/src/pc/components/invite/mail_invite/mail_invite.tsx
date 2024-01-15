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
import { INVITE_TOKEN_LENGTH } from '../constant';

const MailInvite: FC<React.PropsWithChildren<unknown>> = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const tokenParams = query.get('inviteToken');
  const mailTokenParams = query.get('inviteMailToken');
  const [inviteMailToken, setInviteMailToken] = useState('');
  const { run: verifyMailUrl } = useRequest((token) => Api.inviteEmailVerify(token), {
    onSuccess: (res) => {
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
      const { isBound, isLogin, isMatch, spaceId } = data;
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
        if (isMatch) {
          //TODO Staying on the invitation page,
          // the user clicks the button and triggers the API before actually joining the space station.
          // API.acceptEmailInvitation(spaceId, inviteMailToken)
          Router.push(Navigation.WORKBENCH, { params: { spaceId }, clearQuery: true });
          return;
        }
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'mail/mismatch' },
          query: { inviteMailToken },
        });
        return;
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
