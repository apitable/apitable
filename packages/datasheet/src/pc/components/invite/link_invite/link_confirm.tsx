import { Button } from '@vikadata/components';
import {
  Api,
  getCustomConfig,
  IReduxState,
  Navigation,
  StatusCode,
  StoreActions,
  Strings,
  t
} from '@vikadata/core';
import { useMount } from 'ahooks';
import Image from 'next/image';
import { Message, Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InviteImage from 'static/icon/common/common_img_invite.png';
import { InviteTitle } from '../components/invite_title';
import { useInvitePageRefreshed } from '../use_invite';

const LinkConfirm: FC = () => {
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
        const { redirectUrlOnUnAuthorization } = getCustomConfig();
        if (redirectUrlOnUnAuthorization) {
          const redirectUri = `${location.pathname}?inviteLinkToken=${inviteLinkToken}&inviteCode=${inviteCode}&nodeId=${nodeId}`;
          location.href = `${redirectUrlOnUnAuthorization}${redirectUri}`;
          return;
        }
        Router.push(Navigation.INVITE, {
          params: { invitePath: 'link/login' },
          query: { inviteLinkToken: inviteLinkToken!, inviteCode, nodeId }
        });
      } else {
        // 链接失效，更新数据
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
