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
import classNames from 'classnames';
import parser from 'html-react-parser';
import { FC } from 'react';
import { ApiInterface, ConfigConstant, IReduxState, Strings, t } from '@apitable/core';
import { Wrapper } from 'pc/components/common';
import { useUserRequest } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { InviteTitle } from '../components';
import { useInvitePageRefreshed } from '../use_invite';
// @ts-ignore
import { IdentifyingCodeLogin } from 'enterprise/home/login/identifying_code_login/identifying_code_login';
import styles from './style.module.less';

const MailBindPhone: FC<React.PropsWithChildren<unknown>> = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const { loginOrRegisterReq } = useUserRequest();

  useMount(() => {
    whenPageRefreshed();
  });

  const submitRequest = (data: any) => {
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
          {IdentifyingCodeLogin && (
            <IdentifyingCodeLogin
              submitRequest={submitRequest}
              submitText={t(Strings.confirm_join)}
              mode={ConfigConstant.LoginMode.MAIL}
              footer={parser(t(Strings.old_user_turn_to_home))}
              config={{ mail: { defaultValue: inviteEmailInfo?.data.inviteEmail, disabled: true } }}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
};
export default MailBindPhone;
