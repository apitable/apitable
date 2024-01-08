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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api, IInviteEmailInfo, IInviteLinkInfo, IInviteMemberList, IReduxState, Navigation, StatusCode, StoreActions } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { IParams } from 'pc/components/route_manager/interface';
import { Router } from 'pc/components/route_manager/router';
import { secondStepVerify } from 'pc/hooks/utils';
import { useAppSelector } from 'pc/store/react-redux';
import { getSearchParams } from 'pc/utils/dom';
import { execNoTraceVerification } from 'pc/utils/no_trace_verification';

// @ts-ignore

interface IJoinFuncProps {
  fromLocalStorage?: boolean;
}

export const useLinkInvite = () => {
  const urlParams = getSearchParams();
  const dispatch = useDispatch();
  const inviteLinkTokenInUrl = urlParams.get('inviteLinkToken');
  const inviteLinkData = urlParams.get('inviteLinkData');
  const inviteNodeIdInUrl = urlParams.get('nodeId');
  const inviteLinkInfo = useAppSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteLinkTokenInStore = useAppSelector((state: IReduxState) => state.invite);
  const nodeId = useAppSelector((state: IReduxState) => state.invite.nodeId);

  // Retrieval of information
  const reGetLinkInfo = (linkToken: string, nodeId: string, inviteLinkData?: string) => {
    Api.linkValid(linkToken, nodeId).then((res) => {
      const { success, data: info } = res.data;
      dispatch(StoreActions.updateInviteLinkInfo(res.data));
      dispatch(StoreActions.updateMailToken(linkToken));
      if (success) {
        Api.joinViaSpace(linkToken, nodeId, inviteLinkData).then((res) => {
          if (res.data.success) {
            Router.redirect(Navigation.WORKBENCH, { query: { spaceId: info.spaceId }, clearQuery: true });
            return;
          }
        });
      } else {
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'link/invalid' },
          query: { inviteLinkToken: linkToken },
        });
        return;
      }
    });
  };

  const join = (props?: IJoinFuncProps) => {
    const fromLocalStorage = props ? Boolean(props.fromLocalStorage) : false;
    const inviteLinkDataStorage = localStorage.getItem('invite_link_data');
    // Retrieval of information
    if (fromLocalStorage && inviteLinkDataStorage) {
      const { linkToken, nodeId, inviteLinkData } = JSON.parse(inviteLinkDataStorage);
      reGetLinkInfo(linkToken, nodeId, inviteLinkData);
      return;
    }

    // Get data from the store
    if (inviteLinkTokenInStore && inviteLinkInfo && nodeId) {
      Api.joinViaSpace(inviteLinkTokenInStore.linkToken, nodeId, inviteLinkTokenInStore.inviteLinkData).then((res) => {
        if (res.data.success) {
          Router.redirect(Navigation.WORKBENCH, { query: { spaceId: inviteLinkInfo.data.spaceId }, clearQuery: true });
        } else {
          Router.redirect(Navigation.WORKBENCH);
        }
        return;
      });
    }
    // The user refreshes the page and re-fetches the data
    if (inviteLinkTokenInUrl) {
      reGetLinkInfo(inviteLinkTokenInUrl, inviteNodeIdInUrl, inviteLinkData);
      return;
    }
  };

  return { join };
};

type IInvitePageType = 'mailInvite' | 'linkInvite';

interface IInvitePageRefreshedProps {
  type: IInvitePageType;
}

export const useInvitePageRefreshed = (data: IInvitePageRefreshedProps) => {
  const { type } = data;
  const urlParams = new URLSearchParams(window.location.search);
  const inviteLinkInfo = useAppSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  let inviteTokenInUrl: string | null;
  let inviteInfo: IInviteLinkInfo | IInviteEmailInfo | null;
  let invitePath: IParams['invitePath'];
  if (type === 'linkInvite') {
    inviteTokenInUrl = urlParams.get('inviteLinkToken');
    inviteInfo = inviteLinkInfo;
    invitePath = 'link';
  }

  if (type === 'mailInvite') {
    inviteTokenInUrl = urlParams.get('inviteMailToken');
    inviteInfo = inviteEmailInfo;
    invitePath = 'mail';
  }

  const whenPageRefreshed = () => {
    if (inviteTokenInUrl && !inviteInfo) {
      Router.push(Navigation.INVITE, {
        params: { invitePath },
        query: {
          inviteMailToken: type === 'mailInvite' ? inviteTokenInUrl : undefined,
          inviteLinkToken: type === 'linkInvite' ? inviteTokenInUrl : undefined,
        },
      });
    }
  };

  return { whenPageRefreshed };
};
export const useEmailInviteInModal = (spaceId: string, invite: IInviteMemberList[], shareId?: string, secondVerify?: null | string) => {
  const dispatch = useDispatch();
  const [isInvited, setIsInvited] = useState(false);
  const [invitedCount, setInvitedCount] = useState(0);
  const [err, setErr] = useState('');

  const request = useCallback(
    (nvcVal?: string) => {
      Api.sendInvite(spaceId, invite, nvcVal).then((res) => {
        const { success, message, code } = res.data;
        setIsInvited(true);
        if (success) {
          setInvitedCount(invite.length);
          setErr('');
        } else {
          if (secondStepVerify(code)) {
            return;
          }
          if (code === StatusCode.COMMON_ERR) {
            Message.error({ content: message });
            return;
          }

          setErr(message);
        }
      });
    },
    [spaceId, invite],
  );

  useEffect(() => {
    secondVerify && invite.length && request(secondVerify);
    // eslint-disable-next-line
  }, [secondVerify]);

  useEffect(() => {
    if (!invite.length) {
      setIsInvited(false);
      setInvitedCount(0);
      setErr('');
      return;
    }

    window['nvc'] ? execNoTraceVerification(request) : request();
  }, [spaceId, dispatch, invite, shareId, request]);
  return { isInvited, invitedCount, err };
};
