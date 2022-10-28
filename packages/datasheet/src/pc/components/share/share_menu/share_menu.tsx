import { useThemeColors } from '@vikadata/components';
import { AutoTestID, ConfigConstant, Navigation, Selectors, Strings, t, ThemeName } from '@apitable/core';
import { Tree } from 'antd';
import classNames from 'classnames';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { Avatar, AvatarSize, Logo, Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import * as React from 'react';
import { ReactText } from 'react';
import { useSelector } from 'react-redux';
import PullDownIcon from 'static/icon/common/common_icon_pulldown.svg';
import EditPng from 'static/icon/datasheet/share/datasheet_img_share_edit.png';
import SavePng from 'static/icon/datasheet/share/datasheet_img_share_save.png';
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
  const activedNodeId = useSelector(state => Selectors.getNodeId(state))!;
  const shareId = useSelector(state => state.pageParams.shareId);

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
    return node!.map(item => {
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
          <PullDownIcon fill={colors.staticWhite0} />
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

export const ShareMenu: React.FC<IShareMenu> = ({ shareSpace, shareNode, visible, setVisible, loading }) => {
  const userInfo = useSelector(state => state.user.info);
  const { formId, viewId } = useSelector(state => state.pageParams);
  const activedNodeId = useSelector(state => Selectors.getNodeId(state));

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
        Router.push(Navigation.LOGIN, { query: { reference: window.location.href, spaceId: shareSpace.spaceId }});
      },
      okButtonProps: { id: AutoTestID.GO_LOGIN_BTN },
      type: 'warning',
    });
  };

  const singleFormShare = formId && shareNode?.nodeId === formId;
  return (
    <div className={styles.shareMenu}>
      <div className={styles.logo} onClick={enterSpace}>
        <Logo theme={ThemeName.Light} size='large' />
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
          {userInfo && userInfo.spaceId && shareSpace.allowEdit && (
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
