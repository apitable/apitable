import { useThemeColors } from '@vikadata/components';
import { IReduxState, ISpaceInfo, IUserInfo, Navigation, Strings, t } from '@vikadata/core';
import { useUpdateEffect } from 'ahooks';
import { Popover } from 'antd';
import classnames from 'classnames';
import { truncate } from 'lodash';
import Image from 'next/image';
import { Avatar, AvatarSize, AvatarType, ButtonPlus, ContextmenuItem, Modal, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { SocialPlatformMap } from 'pc/components/home/social_platform/config';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform/utils';
import { NavigationContext } from 'pc/components/navigation/navigation_context';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useNotificationCreate, useResponsive } from 'pc/hooks';
import * as React from 'react';
import { FC, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import MoreIcon from 'static/icon/common/common_icon_more_stand.svg';
import ExitIcon from 'static/icon/space/space_icon_quitspace.svg';
import ManagerIcon from 'static/icon/workbench/workbench_tab_icon_manage_normal.svg';
import styles from './style.module.less';

export interface ISpaceListItemProps {
  spaceInfo: ISpaceInfo;
  actived?: boolean;
  managable?: boolean;
  refreshList?: () => void;
}

export const SpaceListItem: FC<ISpaceListItemProps> = ({
  spaceInfo,
  actived = false,
  managable = false,
  refreshList,
}) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const navigationTo = useNavigation();
  const { closeSpaceListDrawer } = useContext(NavigationContext);
  const user = useSelector((state: IReduxState) => state.user.info) as IUserInfo;
  const { memberQuitSpaceAndNotice } = useNotificationCreate({ fromUserId: user.uuid, spaceId: user.spaceId });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { spaceId, spaceDomain, name, logo, point } = spaceInfo;
  const domain = process.env.NODE_ENV === 'production' && spaceDomain && document.domain !== spaceDomain ?
    `${window.location.protocol}//${spaceDomain}` : '';

  useUpdateEffect(() => {
    if (user) {
      closeSpaceListDrawer();
      navigationTo({ path: Navigation.SPACE_MANAGE, params: { spaceId: user.spaceId }});
    }
  }, [user.spaceId]);

  const openMoreOperationHandler = e => {
    e.stopPropagation();
  };

  const jumpSpaceManagement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (user.spaceId === spaceId) {
      navigationTo({ path: Navigation.SPACE_MANAGE, params: { spaceId }});
    } else {
      window.location.href = `${domain}/management?spaceId=${spaceId}`;
    }
  };

  const quitSpace = () => {
    Modal.confirm({
      type: 'danger',
      title: t(Strings.confirm_exit),
      content: (
        <div className={styles.quitSpaceContent}>
          {<TComponent
            tkey={t(Strings.confirm_exit_space_with_name)}
            params={{
              spaceNameDiv: <div className={styles.spaceName}>{truncate(name, { length: 16 })} </div>,
            }}
          />}
        </div>
      ),
      onOk: () => memberQuitSpaceAndNotice(spaceId, refreshList),
    });
  };

  const visibleChangeHandler = (visible: boolean) => {
    setVisible(visible);
  };

  const closeMenuHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
  };

  return (
    <div
      className={classnames(styles.spaceListItem, actived && styles.actived, isMobile && styles.mobile)}
      onClick={() => {
        if(actived) {
          closeSpaceListDrawer();
          return;
        }
        window.location.href = `${domain}/workbench?spaceId=${spaceId}`;
      }}
    >

      <div className={styles.logo}>
        <Avatar
          title={name}
          size={AvatarSize.Size32}
          id={spaceId}
          src={logo}
          type={AvatarType.Space}
        />
        {point && <div className={styles.redDot} />}
      </div>
      <div className={styles.leftItem}>
        <div className={styles.name}>
          {name}
        </div>
        {
          isSocialPlatformEnabled(spaceInfo) &&
          <Tooltip title={SocialPlatformMap[spaceInfo.social.platform].toolTipInSpaceListItem} placement="top">
            <span className={styles.platformTag}>
              <Image src={SocialPlatformMap[spaceInfo.social.platform].logo} alt={''}/>
            </span>
          </Tooltip>
        }
      </div>
      {managable ?
        <ButtonPlus.Icon
          icon={<ManagerIcon width={16} height={16} />}
          onClick={jumpSpaceManagement}
          className={classnames(styles.moreBtn, { [styles.visible]: isMobile })}
        /> :
        (
          !isSocialPlatformEnabled(spaceInfo) &&
          <Popover
            overlayClassName={styles.menu}
            trigger="click"
            placement="right"
            align={{ offset: [25] }}
            visible={visible}
            mouseLeaveDelay={0}
            onVisibleChange={visibleChangeHandler}
            content={
              <div className={styles.container} onClick={closeMenuHandler}>
                <ContextmenuItem icon={<ExitIcon />} name={t(Strings.quit_space)} onClick={quitSpace} />
              </div>
            }
          >
            <ButtonPlus.Icon
              icon={<MoreIcon width={16} height={16} fill={colors.thirdLevelText} />}
              onClick={openMoreOperationHandler}
              className={classnames(styles.moreBtn, visible && styles.visible)}
            />
          </Popover>
        )
      }
    </div>
  );
};
