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

import { useUpdateEffect } from 'ahooks';
import { Popover } from 'antd';
import classnames from 'classnames';
import { truncate } from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { FC, useContext, useState } from 'react';
import { useThemeColors } from '@apitable/components';
import { IReduxState, ISpaceInfo, IUserInfo, Navigation, Strings, t } from '@apitable/core';
import { LogoutOutlined, MoreStandOutlined, SettingOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Avatar, AvatarSize, AvatarType, ButtonPlus, ContextmenuItem, Modal, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { NavigationContext } from 'pc/components/navigation/navigation_context';
import { Router } from 'pc/components/route_manager/router';
import { useNotificationCreate, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { SocialPlatformMap } from 'enterprise/home/social_platform/config';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export interface ISpaceListItemProps {
  spaceInfo: ISpaceInfo;
  actived?: boolean;
  managable?: boolean;
  refreshList?: () => void;
}

export const SpaceListItem: FC<React.PropsWithChildren<ISpaceListItemProps>> = ({ spaceInfo, actived = false, managable = false, refreshList }) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const { closeSpaceListDrawer } = useContext(NavigationContext);
  const user = useAppSelector((state: IReduxState) => state.user.info) as IUserInfo;
  const { memberQuitSpaceAndNotice } = useNotificationCreate({ fromUserId: user.uuid, spaceId: user.spaceId });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { spaceId, spaceDomain, name, logo, point } = spaceInfo;
  const domain =
    process.env.NODE_ENV === 'production' && spaceDomain && document.domain !== spaceDomain ? `${window.location.protocol}//${spaceDomain}` : '';

  useUpdateEffect(() => {
    if (user) {
      closeSpaceListDrawer();
      Router.push(Navigation.SPACE_MANAGE, { params: { spaceId: user.spaceId } });
    }
  }, [user.spaceId]);

  const openMoreOperationHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const jumpSpaceManagement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (user.spaceId === spaceId) {
      Router.push(Navigation.SPACE_MANAGE, { params: { spaceId } });
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
          {
            <TComponent
              tkey={t(Strings.confirm_exit_space_with_name)}
              params={{
                spaceNameDiv: <div className={styles.spaceName}>{truncate(name, { length: 16 })} </div>,
              }}
            />
          }
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
        if (actived) {
          closeSpaceListDrawer();
          return;
        }
        window.location.href = `${domain}/workbench?spaceId=${spaceId}`;
      }}
    >
      <div className={styles.logo}>
        <Avatar title={name} size={AvatarSize.Size32} id={spaceId} src={logo} type={AvatarType.Space} />
        {point && <div className={styles.redDot} />}
      </div>
      <div className={styles.leftItem}>
        <div className={styles.name}>{name}</div>
        {isSocialPlatformEnabled?.(spaceInfo) && (
          <Tooltip title={SocialPlatformMap?.[spaceInfo.social.platform].toolTipInSpaceListItem || ''} placement="top">
            <span className={styles.platformTag}>
              <Image src={SocialPlatformMap?.[spaceInfo.social.platform].logo || ''} alt={''} />
            </span>
          </Tooltip>
        )}
      </div>
      {managable ? (
        <ButtonPlus.Icon
          icon={<SettingOutlined size={16} />}
          onClick={jumpSpaceManagement}
          className={classnames(styles.moreBtn, { [styles.visible]: isMobile })}
        />
      ) : (
        !isSocialPlatformEnabled?.(spaceInfo) && (
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
                <ContextmenuItem icon={<LogoutOutlined />} name={t(Strings.quit_space)} onClick={quitSpace} />
              </div>
            }
          >
            <ButtonPlus.Icon
              icon={<MoreStandOutlined size={16} color={colors.thirdLevelText} />}
              onClick={openMoreOperationHandler}
              className={classnames(styles.moreBtn, visible && styles.visible)}
            />
          </Popover>
        )
      )}
    </div>
  );
};
