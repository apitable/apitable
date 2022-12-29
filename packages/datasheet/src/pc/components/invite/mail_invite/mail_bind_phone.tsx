import { ApiInterface, ConfigConstant, IReduxState, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { Wrapper } from 'pc/components/common';
import { IdentifyingCodeLogin, ISubmitRequestParam } from 'pc/components/home/login';
import { useUserRequest } from 'pc/hooks';
import { store } from 'pc/store';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { InviteTitle } from '../components';
import { useInvitePageRefreshed } from '../use_invite';
import styles from './style.module.less';

const MailBindPhone: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const { loginOrRegisterReq } = useUserRequest();

  useMount(() => {
    whenPageRefreshed();
  });

  const submitRequest = (data: ISubmitRequestParam) => {
    const invite = store.getState().invite;
    const spaceId = invite?.inviteLinkInfo?.data?.spaceId || invite?.inviteEmailInfo?.data?.spaceId;
    const loginData: ApiInterface.ISignIn = {
      areaCode: data.areaCode,
      username: data.account,
      type: data.type,
      credential: data.credential,
      data: data.nvcVal,
      spaceId,
    };

    return loginOrRegisterReq(loginData);
  };

  if (!inviteEmailInfo) return null;
  return (
    <Wrapper>
      <div className={classNames('invite-children-center', styles.linkInviteLogin)}>
        {inviteEmailInfo && (
          <InviteTitle
            inviter={inviteEmailInfo.data.inviter}
            spaceName={inviteEmailInfo.data.spaceName}
            desc={t(Strings.complete_invited_email_information, {
              inviteEmail: inviteEmailInfo.data.inviteEmail,
            })}
            titleMarginBottom="40px"
          />
        )}
        <div className={styles.loginContent}>
          <IdentifyingCodeLogin
            submitRequest={submitRequest}
            submitText={t(Strings.confirm_join)}
            mode={ConfigConstant.LoginMode.MAIL}
            footer={parser(t(Strings.old_user_turn_to_home))}
            config={{ mail: { defaultValue: inviteEmailInfo?.data.inviteEmail, disabled: true }}}
          />
        </div>
      </div>
    </Wrapper>
  );
};
export default MailBindPhone;
