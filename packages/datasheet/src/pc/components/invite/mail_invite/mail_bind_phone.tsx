import { Api, ApiInterface, ConfigConstant, IReduxState, isPrivateDeployment, Navigation, StatusCode, Strings, t } from '@vikadata/core';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { Modal, Wrapper } from 'pc/components/common';
import { IdentifyingCodeLogin, ISubmitRequestParam } from 'pc/components/home/login';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useUserRequest } from 'pc/hooks';
import { store } from 'pc/store';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { InviteTitle } from '../components';
import { useInvitePageRefreshed } from '../use_invite';
import styles from './style.module.less';

const MailBindPhone: FC = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const navigationTo = useNavigation();
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const mailToken = useSelector((state: IReduxState) => state.invite.mailToken);
  const isPrivate = isPrivateDeployment();
  const { signUpReq } = useUserRequest();

  useMount(() => {
    whenPageRefreshed();
  });
  // 登录成功，判断登录用户是否已经绑定其他邮箱
  const loginSuccess = () => {
    return Api.emailBind().then(res => {
      const { success, data: phoneIsBind } = res.data;
      if (!success) {
        return res.data;
      }
      if (phoneIsBind) {
        return {
          ...res.data,
          success: false,
          code: StatusCode.ACCOUNT_ERROR,
          message: t(Strings.current_phone_has_been_binded_with_other_email),
        };
      }
      // 未绑定邮箱
      Modal.confirm({
        type: 'default',
        title: t(Strings.please_note),
        content: t(Strings.whether_bind_with_invited_email, {
          inviteEmail: inviteEmailInfo ? `（${inviteEmailInfo.data.inviteEmail}）` : '',
        }),
        cancelText: t(Strings.cancel),
        okText: t(Strings.confirm),
        onOk: () => {
          const email = inviteEmailInfo!.data.inviteEmail;
          const spaceId = inviteEmailInfo!.data.spaceId;
          Api.linkInviteEmail(spaceId, email).then(res => {
            if (res.data.success) {
              navigationTo({ path: Navigation.WORKBENCH, params: { spaceId: inviteEmailInfo!.data.spaceId }, clearQuery: true });
            }
          });
        },
      });
    });
  };

  // TODO: 这里貌似可以用登录那边的复用
  const submitRequest = (data: ISubmitRequestParam) => {
    // 提取邀请加入的 spaceId，赠送空间需要用到
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

    return Api.signInOrSignUp(loginData).then(res => {
      const { success, data: loginToken } = res.data;
      if (success && loginToken && isPrivate) {
        signUpReq(loginToken);
        return;
      }
      if (success && loginToken && !isPrivate) {
        // 新用户，去邀请码页面
        navigationTo({
          path: Navigation.INVITATION_VALIDATION,
          query: {
            token: loginToken,
            inviteCode: inviteEmailInfo?.data.inviteCode,
            inviteMailToken: mailToken,
          },
        });
        return;
      }
      if (success && !loginToken) {
        // 旧用户
        return loginSuccess();
      }
      return res.data;
    });
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
            config={{ mail: { defaultValue: inviteEmailInfo?.data.inviteEmail, disabled: true } }}
          />
        </div>
      </div>
    </Wrapper>
  );
};
export default MailBindPhone;
