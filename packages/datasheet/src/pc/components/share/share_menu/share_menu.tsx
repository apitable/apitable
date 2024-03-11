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

import { Tree } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { ReactText } from 'react';
import { useThemeColors } from '@apitable/components';
import { AutoTestID, ConfigConstant, Navigation, Selectors, Strings, t, ThemeName } from '@apitable/core';
import { TriangleDownFilled } from '@apitable/icons';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { Avatar, AvatarSize, Logo, Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import SavePng from 'static/icon/datasheet/share/datasheet_img_share_save.png';
import EditPngDark from 'static/icon/datasheet/share/share_space_edit_dark.png';
import EditPngLight from 'static/icon/datasheet/share/share_space_edit_light.png';
import { INodeTree, IShareSpaceInfo } from '../interface';
import { ShareSave } from '../share_save';
import { OperationCard } from './operation_card';
import styles from './style.module.less';

const { TreeNode, DirectoryTree } = Tree;

export interface IShareMenu {
  shareSpace: IShareSpaceInfo;
  shareNode: INodeTree | undefined;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const NodeTree = (nodeTree: INodeTree | undefined) => {
  const colors = useThemeColors();
  const activedNodeId = useAppSelector((state) => Selectors.getNodeId(state))!;
  const shareId = useAppSelector((state) => state.pageParams.shareId);

  if (!nodeTree) {
    return <></>;
  }

  function onSelect(selectedKeys: ReactText[]) {
    const [dsId] = selectedKeys;
    Router.push(Navigation.SHARE_SPACE, {
      params: {
        shareId,
        nodeId: dsId as string,
      },
    });
  }

  const renderNode = (node: INodeTree[] | undefined) => {
    if (!node || !node.length) return <></>;
    return node!.map((item) => {
      const icon = getNodeIcon(item.icon, item.type, {
        size: 16,
        emojiSize: 18,
        actived: item.nodeId === activedNodeId,
        normalColor: colors.staticWhite0,
      });
      if (item.type === ConfigConstant.NodeType.FOLDER) {
        return (
          <TreeNode title={item.nodeName} key={item.nodeId} style={{ width: '100%' }} icon={icon}>
            {renderNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.nodeName} key={item.nodeId} style={{ width: '100%' }} isLeaf icon={icon} />;
    });
  };

  const icon = getNodeIcon(nodeTree.icon, nodeTree.type, {
    size: 16,
    emojiSize: 18,
    actived: nodeTree.nodeId === activedNodeId,
    normalColor: colors.staticWhite0,
  });

  return (
    <DirectoryTree
      defaultExpandAll
      onSelect={onSelect}
      switcherIcon={
        <span>
          <TriangleDownFilled color={colors.staticWhite0} size={12} />
        </span>
      }
      selectedKeys={[activedNodeId]}
      expandAction={false}
    >
      {nodeTree.type === ConfigConstant.NodeType.FOLDER && nodeTree.children!.length ? (
        <TreeNode title={nodeTree.nodeName} key={nodeTree.nodeId} style={{ width: '100%' }} icon={icon}>
          {renderNode(nodeTree.children)}
        </TreeNode>
      ) : (
        <TreeNode title={nodeTree.nodeName} key={nodeTree.nodeId} style={{ width: '100%' }} icon={icon} isLeaf />
      )}
    </DirectoryTree>
  );
};

export const ShareMenu: React.FC<React.PropsWithChildren<IShareMenu>> = ({ shareSpace, shareNode, visible, setVisible, loading }) => {
  const userInfo = useAppSelector((state) => state.user.info);
  const { formId, viewId } = useAppSelector((state) => state.pageParams);
  const activedNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const nodeId = shareNode?.nodeId;
  const activeNodePrivate = useAppSelector((state) => {
    const shareNodeTree = state.share.shareNodeTree;
    if (!shareNodeTree) return true;
    return shareNodeTree?.nodeId === nodeId && shareNodeTree?.nodePrivate;
  });
  const env = getEnvVariables();
  const themeName = useAppSelector((state) => state.theme);
  const EditPng = themeName === ThemeName.Light ? EditPngLight : EditPngDark;
  const saveToMySpace = () => {
    setVisible(true);
  };

  const enterSpace = () => {
    Router.redirect(Navigation.HOME);
  };

  const handleLogin = () => {
    Modal.confirm({
      title: t(Strings.kindly_reminder),
      content: t(Strings.require_login_tip),
      okText: t(Strings.go_login),
      onOk: () => {
        if (env.INVITE_USER_BY_AUTH0) {
          localStorage.setItem('share_login_reference', window.location.href);
          Router.push(Navigation.WORKBENCH);
        } else {
          Router.push(Navigation.LOGIN, { query: { reference: window.location.href, spaceId: shareSpace.spaceId } });
        }
      },
      okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
      type: 'warning',
    });
  };

  const singleFormShare = formId && shareNode?.nodeId === formId;

  // The login user is removed from the space station and is not allowed to enter.
  const removedUserHiddenCard = shareSpace.hasLogin && shareSpace.isDeleted;

  return (
    <div className={styles.shareMenu}>
      <div className={styles.logo} onClick={enterSpace}>
        <Logo theme={ThemeName.Dark} size="large" type='SHARE_LOGO' />
      </div>
      <div className={styles.shareInfo}>
        <div className={styles.avatar}>
          <Avatar src={shareSpace.lastModifiedAvatar} title={shareSpace.lastModifiedBy} size={AvatarSize.Size80} id={shareSpace.spaceId} />
          <div className={styles.littleTip}>{t(Strings.partner)}</div>
        </div>
        <p className={styles.customerBane}>{shareSpace.lastModifiedBy}</p>
        <p className={styles.spaceName}>{shareSpace.spaceName}</p>
      </div>
      <div
        className={classNames(styles.treeWrapper, {
          [styles.disableMaxHeight]: !shareSpace.allowSaved,
        })}
      >
        {NodeTree(shareNode)}
      </div>
      {!singleFormShare && (
        <>
          {shareSpace.allowSaved && (
            <OperationCard img={SavePng} tipText={t(Strings.save_action_desc)} btnText={t(Strings.save_to_space)} onClick={saveToMySpace} />
          )}
          {userInfo && userInfo.spaceId && shareSpace.allowEdit && !removedUserHiddenCard && !activeNodePrivate && (
            <OperationCard
              img={EditPng}
              tipText={t(Strings.support_access_to_editors)}
              btnText={t(Strings.access_to_space_station_editors)}
              onClick={() =>
                Router.redirect(Navigation.WORKBENCH, {
                  params: { spaceId: userInfo.spaceId, nodeId: activedNodeId, viewId },
                })
              }
            />
          )}
          {shareSpace.allowEdit && !userInfo && !loading && (
            <OperationCard img={EditPng} tipText={t(Strings.share_login_tip)} btnText={t(Strings.login)} onClick={handleLogin} />
          )}
          {visible && <ShareSave visible={visible} setVisible={setVisible} shareSpace={shareSpace} />}
        </>
      )}
    </div>
  );
};
