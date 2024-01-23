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
import { Button } from '@apitable/components';
import { IReduxState, Navigation, Strings, t } from '@apitable/core';
import { Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { useInvitePageRefreshed } from '../use_invite';
import styles from './style.module.less';

const MailMismatch: FC<React.PropsWithChildren<unknown>> = () => {
  const { whenPageRefreshed } = useInvitePageRefreshed({ type: 'mailInvite' });
  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);

  useMount(() => {
    whenPageRefreshed();
  });

  const toLogin = () => {
    Router.push(Navigation.HOME);
  };

  if (!inviteEmailInfo) return null;
  const tipText = t(Strings.not_mail_invitee_page_tip, { text: inviteEmailInfo!.data.inviteEmail });
  return (
    <Wrapper>
      <div className={classNames('invite-children-center', styles.mismatch)}>
        <h1>{parser(tipText)}</h1>
        <Button onClick={toLogin} style={{ width: '240px', marginTop: '22px' }} color="primary" block>
          {t(Strings.back_to_space)}
        </Button>
      </div>
    </Wrapper>
  );
};
export default MailMismatch;
