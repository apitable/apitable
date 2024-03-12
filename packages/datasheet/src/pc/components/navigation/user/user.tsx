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

import classNames from 'classnames';
import { FC, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { IReduxState } from '@apitable/core';
import { Avatar, AvatarSize } from 'pc/components/common';
import { ScreenSize, ComponentDisplay } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { AccountCenterModal } from '../account_center_modal';
import { InviteCodeModal } from '../invite_code_modal';
import { UserMenu } from '../user_menu';
import styles from './style.module.less';

export const User: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useAppSelector(
    (state: IReduxState) => ({
      user: state.user.info,
      unReadCount: state.notification.unReadCount,
      newNoticeListFromWs: state.notification.newNoticeListFromWs,
    }),
    shallowEqual,
  );
  const [showUserCard, setShowUserCard] = useState(false);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  const openUserMenu = (e: React.MouseEvent) => {
    stopPropagation(e);
    setShowUserCard((prevState) => !prevState);
  };

  if (!user) return null;
  const { memberId, avatar, nickName, avatarColor } = user;

  return (
    <>
      <div onClick={openUserMenu}>
        <Avatar id={memberId} src={avatar} title={nickName} avatarColor={avatarColor} size={AvatarSize.Size40} />
      </div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        {showUserCard && (
          <UserMenu setShowUserMenu={setShowUserCard} setShowAccountCenter={setShowAccountCenter} setShowInviteCode={setShowInviteCode} />
        )}
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open={showUserCard}
          onClose={() => setShowUserCard(false)}
          height={'100%'}
          className={classNames(styles.drawer, styles.userCenterDrawer)}
          destroyOnClose
        >
          <UserMenu setShowUserMenu={setShowUserCard} setShowAccountCenter={setShowAccountCenter} setShowInviteCode={setShowInviteCode} />
        </Popup>
      </ComponentDisplay>
      {showAccountCenter && <AccountCenterModal setShowAccountCenter={setShowAccountCenter} />}
      {showInviteCode && <InviteCodeModal setShowInviteCode={setShowInviteCode} />}
    </>
  );
};
