import { Api, IInviteMemberList, IReduxState, Navigation, StoreActions } from '@vikadata/core';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { secondStepVerify } from 'pc/hooks/utils';
import { getSearchParams } from 'pc/utils';
import { execNoTraceVerification } from 'pc/utils/no_trace_verification';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IJoinFuncProps {
  fromLocalStorage?: boolean;
}

export const useLinkInvite = () => {
  const urlParams = getSearchParams();
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const inviteLinkTokenInUrl = urlParams.get('inviteLinkToken');
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteLinkTokenInStore = useSelector((state: IReduxState) => state.invite.linkToken);

  // 重新获取信息
  const reGetLinkInfo = (linkToken: string) => {
    Api.linkValid(linkToken).then(res => {
      const { success, data: info } = res.data;
      dispatch(StoreActions.updateInviteLinkInfo(res.data));
      dispatch(StoreActions.updateMailToken(linkToken));
      if (success) {
        Api.joinViaSpace(linkToken).then(res => {
          if (res.data.success) {
            navigationTo({ path: Navigation.WORKBENCH, params: { spaceId: info.spaceId }, method: Method.Redirect, clearQuery: true });
            return;
          }
        });
      } else {
        navigationTo({
          path: Navigation.INVITE,
          params: { invitePath: 'link/invalid' },
          query: { inviteLinkToken: linkToken },
        });
        return;
      }
    });
  };

  const join = (props?: IJoinFuncProps) => {
    const fromLocalStorage = props ? Boolean(props.fromLocalStorage) : false;
    const inviteLinkData = localStorage.getItem('invite_link_data');
    // 对于钉钉或qq扫码之后，页面会刷新并且会丢失store数据，需要获取localStorage里的数据，并重新api请求
    if (fromLocalStorage && inviteLinkData) {
      const { linkToken } = JSON.parse(inviteLinkData);
      reGetLinkInfo(linkToken);
      return;
    }
    // 从store里获取数据
    if (inviteLinkTokenInStore && inviteLinkInfo) {
      Api.joinViaSpace(inviteLinkTokenInStore).then(res => {
        if (res.data.success) {
          navigationTo({ path: Navigation.WORKBENCH, params: { spaceId: inviteLinkInfo.data.spaceId }, method: Method.Redirect, clearQuery: true });
        } else {
          navigationTo({ path: Navigation.WORKBENCH, method: Method.Redirect });
        }
        return;
      });
    }
    // 用户刷新了页面，重新获取数据
    if (inviteLinkTokenInUrl) {
      reGetLinkInfo(inviteLinkTokenInUrl);
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
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const navigationTo = useNavigation();
  let inviteTokenInUrl;
  let inviteInfo;
  let invitePath;
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
      navigationTo({
        path: Navigation.INVITE,
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
export const useEmailInviteInModal = (
  spaceId: string,
  invite: IInviteMemberList[],
  shareId?: string,
  secondVerify?: null | string
) => {
  const dispatch = useDispatch();
  const [isInvited, setIsInvited] = useState(false);
  const [invitedCount, setInvitedCount] = useState(0);
  const [err, setErr] = useState('');

  const request = useCallback((nvcVal?: string) => {
    Api.sendInvite(invite, shareId, nvcVal).then(res => {
      const { success, message, code } = res.data;
      setIsInvited(true);
      if (success) {
        setInvitedCount(invite.length);
        setErr('');
      } else {
        if (secondStepVerify(code)) {
          return;
        }
        setErr(message);
      }
    });
  }, [invite, shareId]);

  useEffect(() => {
    secondVerify && invite.length && request(secondVerify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondVerify]);

  useEffect(() => {
    if (!invite.length) {
      return;
    }

    window['nvc'] ? execNoTraceVerification(request) : request();

    return () => {
      setIsInvited(false);
      setInvitedCount(0);
      setErr('');
    };
  }, [spaceId, dispatch, invite, shareId, request]);
  return { isInvited, invitedCount, err };
};
