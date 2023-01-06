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

import { Typography } from '@apitable/components';
import { ConfigConstant, IReduxState, Navigation as NavigationConst, Strings, t } from '@apitable/core';
import { AuditOutlined, ManagePowerOutlined, RocketOutlined, TestOutlined } from '@apitable/icons';
import { Tree } from 'antd';
// @ts-ignore
import { isEnterprise, Log, Marketing } from 'enterprise';
import { compact } from 'lodash';
import { useRouter } from 'next/router';
import { ScreenSize } from 'pc/components/common/component_display';
import { OrganizationHead } from 'pc/components/organization_head';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive } from 'pc/hooks';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import * as React from 'react';
import { ReactText, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PullDownIcon from 'static/icon/datasheet/rightclick/rightclick_icon_retract.svg';
import ApplicationIcon from 'static/icon/space/application_outlined.svg';
import DashBoardIcon from 'static/icon/space/space_icon_dashboard_normal.svg';
import AddressIcon from 'static/icon/space/space_icon_manage_address_normal.svg';
import WorkBenchIcon from 'static/icon/space/space_icon_manage_workingtable_normal.svg';
import styles from './style.module.less';

const { TreeNode, DirectoryTree } = Tree;

const SPACE_INFO_KEY = 'overview';
const DEFAULT_PATH_KEY = SPACE_INFO_KEY;

const getPathKey = (menuTree: ISpaceNavInfo[], pathname: string): string[] => {
  const pathList = pathname.split('/');
  const pathKey = pathList[pathList.length - 1];
  if (menuTree.find(item => item.key === pathKey || (item.children && item.children.find(item => item.key === pathKey)))) {
    return [pathKey];
  }
  return [DEFAULT_PATH_KEY];
};

interface ISpaceNavInfo {
  key: string;
  title: string;
  routeAddress?: string;
  icon?: React.ReactNode;
  valid?: boolean;
  children?: ISpaceNavInfo[];
}

export const getSpaceNavList = (isMainAdmin: boolean, permissions: string[], marketplaceDisable?: boolean, isSelfVika?: boolean) => compact([
  {
    title: t(Strings.space_info),
    key: SPACE_INFO_KEY,
    icon: <DashBoardIcon />,
    valid: true,
    routeAddress: '/overview',
  },
  Log && {
    title: t(Strings.space_log_title),
    key: 'log',
    icon: <AuditOutlined />,
    valid: isMainAdmin && getEnvVariables().SPACE_LOGS_VISIBLE,
    routeAddress: '/log',
  },
  {
    title: t(Strings.view_permission_description),
    key: 'workbench',
    icon: <WorkBenchIcon />,
    valid: (isMainAdmin || permissions.includes(ConfigConstant.PermissionCode.WORKBENCH)) && getEnvVariables().SPACE_PERMISSION_OVERVIEW_VISIBLE,
    routeAddress: '/workbench',
  },
  {
    title: t(Strings.upgrade_space),
    key: 'upgrade',
    icon: <RocketOutlined />,
    valid: Boolean(isSelfVika && !isMobileApp() && getEnvVariables().SPACE_UPGRADE_PAGE_VISIBLE),
    routeAddress: '/upgrade',
  },
  {
    title: t(Strings.organization_and_role),
    key: 'addressManage',
    icon: <AddressIcon />,
    valid:
      isMainAdmin ||
      permissions.includes(ConfigConstant.PermissionCode.TEAM) ||
      permissions.includes(ConfigConstant.PermissionCode.MEMBER) ||
      permissions.includes(ConfigConstant.PermissionCode.MANAGE_ROLE),
    children: [
      {
        routeAddress: '/managemember',
        title: t(Strings.members_setting),
        key: 'managemember',
        valid: true,
      },
      {
        routeAddress: '/role',
        title: t(Strings.tab_role),
        key: 'role',
        valid: permissions.includes(ConfigConstant.PermissionCode.MANAGE_ROLE) && getEnvVariables().SPACE_ROLE_VISIBLE,
      },
      {
        title: t(Strings.share_permisson_model_space_admin),
        key: 'manager',
        valid: isMainAdmin,
        routeAddress: '/manager',
      },
    ],
  },
  {
    title: t(Strings.permission_and_security),
    key: 'security',
    icon: <ManagePowerOutlined />,
    valid: (isMainAdmin || permissions.includes(ConfigConstant.PermissionCode.SECURITY)) && getEnvVariables().SPACE_SECURITY_PAGE_VISIBLE,
    routeAddress: '/security',
  },
  {
    title: t(Strings.space_manage_menu_social),
    key: 'marketing',
    icon: <ApplicationIcon />,
    valid: isMainAdmin && !marketplaceDisable && !isMobileApp() && Boolean(Marketing),
    routeAddress: '/marketing',
  },
  {
    title: t(Strings.admin_test_function),
    key: 'test-function',
    icon: <TestOutlined />,
    routeAddress: '/test-function',
    valid: getEnvVariables().SPACE_EXPERIMENTAL_FEATURES_VISIBLE,
  },
]);

export const SpaceMenuTree: React.FC = () => {
  const { spaceId, spaceResource, userInfo, appType } = useSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      spaceResource: state.spacePermissionManage.spaceResource,
      userInfo: state.user.info,
      appType: state.space.curSpaceInfo?.social.appType,
    }),
    shallowEqual,
  );
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { SPACE_INTEGRATION_PAGE_VISIBLE } = getEnvVariables();
  const [menuTree, setMenuTree] = useState<ISpaceNavInfo[]>([]);

  const onSelect = (key: ReactText[]) => {
    Router.push(NavigationConst.SPACE_MANAGE, {
      params: {
        spaceId,
        pathInSpace: key[0] as string,
      },
    });
  };

  const router = useRouter();
  const selectedKeys = getPathKey(menuTree, router.pathname);
  useEffect(() => {
    if (!spaceResource) {
      return;
    }
    const { mainAdmin, permissions } = spaceResource;
    const navList = getSpaceNavList(mainAdmin, permissions, !SPACE_INTEGRATION_PAGE_VISIBLE, appType == null);
    if (isMobile) {
      setMenuTree(navList.slice(0, 1));
      return;
    }
    setMenuTree(navList);
  }, [spaceResource, SPACE_INTEGRATION_PAGE_VISIBLE, appType, isMobile]);

  const renderTreeNode = (data: ISpaceNavInfo[]) => {
    if (!spaceResource || !data || !data.length) {
      return null;
    }
    return data.map(item => {
      if (!isEnterprise && ['upgrade', 'security'].includes(item.key)) {
        return [];
      }
      if (userInfo && userInfo.isDelSpace && item.key !== SPACE_INFO_KEY) {
        return [];
      }
      if (!item.valid) {
        return [];
      }
      if (item.children && item.children.length) {
        return (
          <TreeNode title={item.title} key={item.key} selectable={false} icon={item.icon}>
            {renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} icon={item.icon} className={item.icon ? styles.noIcon : ''} isLeaf />;
    });
  };

  return (
    <div className={styles.spaceMenuTree}>
      <OrganizationHead />
      <Typography variant='h8' className={styles.spaceSubTitle}>
        {t(Strings.space_setting)}
      </Typography>
      {spaceResource && menuTree.length > 0 && (
        <DirectoryTree
          onSelect={onSelect}
          switcherIcon={
            <div>
              <PullDownIcon />
            </div>
          }
          // defaultSelectedKeys={[SPACE_INFO_KEY]}
          showIcon
          expandAction={false}
          selectedKeys={selectedKeys}
          defaultExpandAll
        >
          {renderTreeNode(menuTree)}
        </DirectoryTree>
      )}
    </div>
  );
};
