import { useThemeColors } from '@vikadata/components';
import { ConfigConstant, findNode, IShareInfo, Navigation, Selectors, StoreActions, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { Message } from 'pc/components/common/message';
import { Tooltip } from 'pc/components/common/tooltip';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { usePageParams, useRequest, useSideBarVisible, useUserRequest } from 'pc/hooks';
import { deleteStorageByKey, getStorage, StorageName } from 'pc/utils/storage/storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import Openup from 'static/icon/workbench/openup.svg';
import Packup from 'static/icon/workbench/packup.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { DashboardPanel } from '../dashboard_panel';
import { DataSheetPane } from '../datasheet_pane';
import { FolderShowcase } from '../folder_showcase';
import { FormPanel } from '../form_panel';
import { ShareMenu } from '../share/share_menu';
import { ApplicationJoinSpaceAlert } from './application_join_space_alert';
import { ShareFail } from './share_fail';
import { ShareMobile } from './share_mobile/share_mobile';
import styles from './style.module.less';
import Head from 'next/head';

export interface IShareSpaceInfo {
  shareId: string;
  spaceName: string;
  spaceId: string;
  allowSaved: boolean;
  allowApply: boolean;
  allowEdit: boolean;
  lastModifiedAvatar: string;
  lastModifiedBy: string;
  hasLogin: boolean;
  isFolder: boolean;
}

export interface INodeTree {
  nodeId: string;
  nodeName: string;
  children: INodeTree[];
  type: ConfigConstant.NodeType;
  icon: string;
  shareType?: ConfigConstant.NodeType;
}

export const ShareContext = React.createContext({} as { shareInfo: IShareSpaceInfo });

interface IShareProps {
  shareInfo: Required<IShareInfo> | undefined;
}

const Share: React.FC<IShareProps> = ({ shareInfo }) => {
  const colors = useThemeColors();
  /** 控制侧边栏的显隐 */
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const shareLoginFailed = getStorage(StorageName.ShareLoginFailed);
  const { shareId, datasheetId, folderId, formId, dashboardId, mirrorId } = useSelector(state => state.pageParams);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const userInfo = useSelector(state => state.user.info);
  const navigationTo = useNavigation();
  const [nodeTree, setNodeTree] = useState<INodeTree>();
  const [visible, setVisible] = useState(false);
  const [shareSpace, setShareSpace] = useState<IShareSpaceInfo | undefined>();
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const dispatch = useDispatch();
  const [shareClose, setShareClose] = useState(false);

  usePageParams();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  useEffect(() => {
    if (typeof shareLoginFailed !== 'boolean') {
      return;
    }
    if (shareLoginFailed) {
      Message.error({ content: t(Strings.login_failed) });
    } else {
      Message.success({ content: t(Strings.login) + t(Strings.success) });
    }
    deleteStorageByKey(StorageName.ShareLoginFailed);
  }, [shareLoginFailed]);

  useEffect(() => {
    if (!shareSpace) {
      return;
    }

    if (!shareSpace.hasLogin) {
      dispatch(StoreActions.setLoading(false));
      return;
    }
    getLoginStatus({ spaceId: shareSpace.spaceId }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareSpace]);

  useEffect(() => {
    if (!shareInfo) {
      setShareClose(true);
      return;
    }
    const { shareNodeId, shareNodeName, shareNodeType, nodeTree, shareNodeIcon, ...shareSpaceInfo } = shareInfo;
    setShareSpace(shareSpaceInfo as IShareSpaceInfo);
    setNodeTree({
      nodeId: shareNodeId,
      nodeName: shareNodeName,
      type: shareNodeType,
      icon: shareNodeIcon,
      children: nodeTree,
    });
    // _dispatch(StoreActions.setPageParams({
    //   shareId: shareSpaceInfo.shareId
    // }));
    if (shareInfo.isFolder && nodeTree.length === 0) {
      // 空文件夹
      return;
    }
    dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([...nodeTree, { nodeId: shareNodeId, nodeName: shareNodeName, icon: shareNodeIcon }])));
    dispatch(StoreActions.fetchMarketplaceApps(shareSpaceInfo.spaceId as string));
    dispatch(
      StoreActions.setShareInfo({
        spaceId: shareSpaceInfo.spaceId,
        allowCopyDataToExternal: shareSpaceInfo.allowCopyDataToExternal,
        allowDownloadAttachment: shareSpaceInfo.allowDownloadAttachment,
        featureViewManualSave: shareSpaceInfo.featureViewManualSave,
      }),
    );
    if (datasheetId) {
      return;
    }
    setTimeout(() => {
      console.log('share navigationTo');
      navigationTo({
        path: Navigation.SHARE_SPACE,
        params: { shareId: shareSpaceInfo.shareId, nodeId: shareNodeId },
      });
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shareInfo)]);

  if (shareClose) {
    return <ShareFail />;
  }

  const judgeAllowEdit = () => {
    if (shareSpace && (shareSpace.hasLogin || !shareSpace.allowEdit)) {
      return;
    }
    Message.destroy();
    Message.warning({
      content: (
        <>
          {t(Strings.share_edit_tip)}
          <i
            onClick={() => {
              navigationTo({ path: Navigation.LOGIN, query: { reference: window.location.href, spaceId: shareSpace ? shareSpace.spaceId : '' } });
            }}
          >
            {t(Strings.login)}
          </i>
        </>
      ),
    });
  };

  const handleClick = () => {
    setSideBarVisible(!sideBarVisible);
  };

  const getComponent = () => {
    if (!nodeTree) {
      return;
    }
    if (mirrorId) {
      return <MirrorRoute />;
    } else if (datasheetId) {
      return <DataSheetPane />;
    } else if (formId) {
      return <FormPanel loading={loading} />;
    } else if (dashboardId) {
      return <DashboardPanel />;
    } else if (folderId) {
      const parentNode = findNode([nodeTree], folderId);
      const childNodes = (parentNode && parentNode.children) ?? [];
      return (
        <FolderShowcase
          nodeInfo={{
            name: treeNodesMap[folderId]?.nodeName || '',
            id: folderId,
            icon: treeNodesMap[folderId]?.icon || '',
          }}
          childNodes={childNodes}
          readOnly
        />
      );
    }
    return null;
  };

  if (!shareSpace) {
    dispatch(StoreActions.setLoading(false));
    return <></>;
  }

  const localSize = localStorage.getItem('splitPos');
  const defaultSize = localSize ? parseInt(localSize, 10) : 320;
  const closeBtnClass = classNames({
    [styles.closeBtn]: true,
    [styles.isPanelClose]: !sideBarVisible,
  });

  const closeBtnStyles: React.CSSProperties = {};
  if (shareId) {
    closeBtnStyles.top = '26px';
    if (!sideBarVisible) {
      closeBtnStyles.left = '-8px';
    }
  }

  // 控制申请加入空间站功能的显示
  const applicationJoinAlertVisible = shareSpace.allowApply && !loading && (!userInfo || (userInfo && !userInfo.spaceId));

  /** 表示该分享只有一个表单节点 */
  const singleFormShare = formId && nodeTree?.nodeId === formId;
  return (
    <ShareContext.Provider value={{ shareInfo: shareSpace }}>
      <Head>
        <meta property="og:title" content={shareInfo?.shareNodeName || '维格表'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://s1.vika.cn/space/2021/12/01/992611616a744743a75c4b916e982dd6" />
        <meta property="og:site_name" content="维格表" />
        <meta property="og:description" content="维格表, 积木式多媒体数据表格, 维格表技术首创者, 数据整理神器, 让人人都是数据设计师" />
      </Head>
      <div
        className={classNames(styles.share, {
          [styles.hiddenCatalog]: !sideBarVisible,
          [styles.formShare]: formId && nodeTree?.nodeId !== formId, // 表示神奇表单是通过文件夹来分享的
        })}
      >
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          {singleFormShare ? (
            <FormPanel loading={loading} />
          ) : (
            <SplitPane
              split="vertical"
              minSize={320}
              defaultSize={defaultSize}
              maxSize={640}
              style={{ overflow: 'none' }}
              size={sideBarVisible ? defaultSize : 0}
              allowResize={sideBarVisible}
              onChange={() => {
                window.dispatchEvent(new Event('resize'));
              }}
              pane2Style={{ overflow: 'hidden' }}
              resizerStyle={{ backgroundColor: 'transparent', minWidth: 'auto' }}
            >
              <div className={styles.splitLeft}>
                {sideBarVisible && (
                  <ShareMenu shareSpace={shareSpace} shareNode={nodeTree} visible={visible} setVisible={setVisible} loading={loading} />
                )}
                <Tooltip
                  title={!sideBarVisible ? t(Strings.expand_pane) : t(Strings.hide_pane)}
                  placement={!sideBarVisible ? 'right' : 'bottom'}
                  offset={[0, 0]}
                >
                  <div className={closeBtnClass} style={closeBtnStyles} onClick={handleClick}>
                    {!sideBarVisible ? <Openup width={16} height={16} /> : <Packup width={16} height={16} />}
                  </div>
                </Tooltip>
              </div>
              <div
                className={styles.gridContainer}
                style={{
                  height: '100%',
                  padding: shareId ? '16px 15px 16px 0' : '',
                  background: shareId ? colors.primaryColor : '',
                  borderLeft: shareId && !sideBarVisible ? '16px solid ' + colors.primaryColor : '',
                }}
              >
                <div className={styles.wrapper} onDoubleClick={judgeAllowEdit}>
                  {getComponent()}
                </div>
                {applicationJoinAlertVisible && (
                  <ApplicationJoinSpaceAlert spaceId={shareSpace.spaceId} spaceName={shareSpace.spaceName} defaultVisible={shareSpace.allowApply} />
                )}
              </div>
            </SplitPane>
          )}
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <ShareMobile
            shareSpace={shareSpace}
            shareNode={nodeTree}
            visible={visible}
            setVisible={setVisible}
            applicationJoinAlertVisible={applicationJoinAlertVisible}
            loading={loading}
          />
        </ComponentDisplay>
      </div>
    </ShareContext.Provider>
  );
};

export default Share;
