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

import { Button } from '@apitable/components';
import { Api, IReduxState, Navigation, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import Image from 'next/image';
import { Message, Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InviteImage from 'static/icon/common/common_img_invite.png';
import { InviteTitle } from '../components/invite_title';
import { useInvitePageRefreshed } from '../use_invite';

const LinkConfirm: FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useDispatch();
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'linkInvite' });
  const query = useQuery();
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteLinkToken = query.get('inviteLinkToken');
  const inviteCode = query.get('inviteCode') || undefined;
  const nodeId = query.get('nodeId');
  const shareId = query.get('shareId') || '';

  const { loading, run: join } = useRequest((linkToken, nodeId) => Api.joinViaSpace(linkToken, nodeId), {
    onSuccess: res => {
      const { success, code } = res.data;
      if (success) {
        Router.push(Navigation.WORKBENCH, { params: { spaceId: inviteLinkInfo!.data.spaceId, nodeId: shareId }, clearQuery: true });
        dispatch(StoreActions.updateInviteLinkInfo(null));
        dispatch(StoreActions.updateErrCode(null));
      } else if (code === StatusCode.UN_AUTHORIZED) {
        const { LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL, INVITE_USER_BY_AUTH0 } = getEnvVariables();
        if (LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL) {
          const redirectUri = `${location.pathname}?inviteLinkToken=${inviteLinkToken}&inviteCode=${inviteCode}&nodeId=${nodeId}`;
          location.href = `${LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL}${redirectUri}`;
          return;
        }
        if (INVITE_USER_BY_AUTH0) {
          Router.push(Navigation.WORKBENCH);
          return;
        }
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'link/login' },
          query: { inviteLinkToken: inviteLinkToken!, inviteCode, nodeId }
        });
      } else {
        window.location.reload();
      }
      return;
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  useMount(() => {
    whenPageRefreshed();
  });

  const confirmBtn = () => {
    join(inviteLinkToken, nodeId);
  };
  if (!inviteLinkInfo) {
    return null;
  }

  return (
    <Wrapper>
      <div className='invite-children-center'>
        <span style={{ marginBottom: '24px' }}>
          <Image src={InviteImage} alt={t(Strings.link_failure)} width={240} height={180} />
        </span>
        <InviteTitle
          inviter={inviteLinkInfo.data.memberName}
          spaceName={inviteLinkInfo.data.spaceName}
          titleMarginBottom='40px'
        />
        <Button
          onClick={confirmBtn}
          color='primary'
          size='large'
          style={{ width: '220px' }}
          loading={loading}
          disabled={loading}
        >
          {t(Strings.confirm_join)}
        </Button>
      </div>
    </Wrapper>
  );
};

export default LinkConfirm;
