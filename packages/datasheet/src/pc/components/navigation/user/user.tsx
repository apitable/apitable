
import { FC, useState } from 'react';
import { ScreenSize, ComponentDisplay } from 'pc/components/common/component_display/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useSelector, shallowEqual } from 'react-redux';
import { IReduxState } from '@vikadata/core';
import { Avatar, AvatarSize } from 'pc/components/common';
import { AccountCenterModal } from '../account_center_modal';
import styles from './style.module.less';
import classNames from 'classnames';
import { UserMenu } from '../user_menu';
import { InviteCodeModal } from '../invite_code_modal';
import { stopPropagation } from 'pc/utils';
export const User: FC = () => {
  const { user } = useSelector((state: IReduxState) => ({
    user: state.user.info,
    unReadCount: state.notification.unReadCount,
    newNoticeListFromWs: state.notification.newNoticeListFromWs,
  }), shallowEqual);
  const [showUserCard, setShowUserCard] = useState(false);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  const openUserMenu = (e) => {
    stopPropagation(e);
    setShowUserCard(prevState => !prevState);
  };
  return(
    <>
      <div onClick={openUserMenu} data-sensors-click>
        <Avatar id={user!.memberId} src={user!.avatar} title={user!.nickName} size={AvatarSize.Size40} />
      </div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        {
          showUserCard 
          && <UserMenu setShowUserMenu={setShowUserCard} setShowAccountCenter={setShowAccountCenter} setShowInviteCode={setShowInviteCode} />
        }
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          visible={showUserCard}
          onClose={() => setShowUserCard(false)}
          height={'100%'}
          className={classNames(styles.drawer, styles.userCenterDrawer)}
          destroyOnClose
        >
          <UserMenu setShowUserMenu={setShowUserCard} setShowAccountCenter={setShowAccountCenter} setShowInviteCode={setShowInviteCode}/>
        </Popup>
      </ComponentDisplay>
      {showAccountCenter && <AccountCenterModal setShowAccountCenter={setShowAccountCenter} />}
      {showInviteCode && <InviteCodeModal setShowInviteCode={setShowInviteCode}/> }
    </>
  );
};