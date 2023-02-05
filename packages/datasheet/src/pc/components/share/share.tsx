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

import { useThemeColors } from '@apitable/components';
import { findNode, integrateCdnHost, IShareInfo, Navigation, Selectors, Settings, StoreActions, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import Head from 'next/head';
import { Message } from 'pc/components/common/message';
import { Tooltip } from 'pc/components/common/tooltip';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { Router } from 'pc/components/route_manager/router';
import { usePageParams, useRequest, useSideBarVisible, useSpaceRequest, useUserRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { isIframe } from 'pc/utils/env';
import { deleteStorageByKey, getStorage, StorageName } from 'pc/utils/storage/storage';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { INodeTree, IShareSpaceInfo } from './interface';
import { ShareFail } from './share_fail';
import { ShareMobile } from './share_mobile/share_mobile';
import styles from './style.module.less';
// @ts-ignore
import { isEnterprise } from 'enterprise';

export const ShareContext = React.createContext({} as { shareInfo: IShareSpaceInfo });

interface IShareProps {
  shareInfo: Required<IShareInfo> | undefined;
}

const ComponentWrapper = ({
  isIframeShowSharemenu, shareId, sideBarVisible, judgeAllowEdit,
  children, shareSpaceId, applicationJoinAlertVisible, shareSpace, shareSpaceName,
}) => {
  const colors = useThemeColors();
  return (
    <div
      className={classNames(styles.gridContainer, {
        [styles.containerAfter]: !isIframe(),
        [styles.iframeShareContainer]: isIframe(),
      })}
      style={{
        height: '100%',
        width: isIframeShowSharemenu ? '100%' : '',
        padding: shareId && !isIframe() ? '16px 15px 0 0' : '',
        paddingBottom: isIframe() ? '40px' : '16px',
        background: shareId && !isIframe() ? colors.primaryColor : '',
        borderLeft: shareId && !sideBarVisible && !isIframe() ? `16px solid ${colors.primaryColor}` : '',
      }}
    >
      <div className={styles.wrapper} onDoubleClick={judgeAllowEdit}>
        {children}
      </div>
      {applicationJoinAlertVisible && (
        <ApplicationJoinSpaceAlert spaceId={shareSpaceId} spaceName={shareSpaceName} defaultVisible={shareSpace.allowApply} />
      )}
    </div>
  );
};

const Share: React.FC<IShareProps> = ({ shareInfo }) => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const shareLoginFailed = getStorage(StorageName.ShareLoginFailed);
  const { shareId, datasheetId, folderId, formId, dashboardId, mirrorId } = useSelector(state => state.pageParams);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const userInfo = useSelector(state => state.user.info);
  const [nodeTree, setNodeTree] = useState<INodeTree>();
  const [visible, setVisible] = useState(false);
  const [shareClose, setShareClose] = useState(false);
  const [shareSpace, setShareSpace] = useState<IShareSpaceInfo | undefined>();
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const { getSpaceListReq } = useSpaceRequest();
  const {
    data: spaceList = [],
    loading: spaceListLoading,
    run: getSpaceList,
  } = useRequest(getSpaceListReq, { manual: true });
  const dispatch = useAppDispatch();

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
    // eslint-disable-next-line
  }, [shareSpace]);

  useEffect(() => {
    if (shareSpace?.hasLogin) {
      getSpaceList();
    }
  }, [shareSpace?.hasLogin, getSpaceList]);

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
      return;
    }
    dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([...nodeTree, { nodeId: shareNodeId, nodeName: shareNodeName, icon: shareNodeIcon }])));
    isEnterprise && dispatch(StoreActions.fetchMarketplaceApps(shareSpaceInfo.spaceId as string));
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
      Router.push(Navigation.SHARE_SPACE, {
        params: { shareId: shareSpaceInfo.shareId, nodeId: shareNodeId },
      });
    }, 0);

    // eslint-disable-next-line
  }, [JSON.stringify(shareInfo)]);

  const component = useMemo(() => {
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
  }, [dashboardId, mirrorId, treeNodesMap, formId, folderId, nodeTree, datasheetId, loading]);

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
              Router.push(Navigation.LOGIN, { query: { reference: window.location.href, spaceId: shareSpace ? shareSpace.spaceId : '' }});
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

  const {
    spaceId: shareSpaceId,
    spaceName: shareSpaceName,
    allowApply,
  } = shareSpace;
  const realSpaceId = userInfo?.spaceId;

  // Control the display of the application to join the space
  const applicationJoinAlertVisible = (
    allowApply &&
    !loading &&
    !spaceListLoading &&
    (!realSpaceId || (spaceList.every(({ spaceId }) => spaceId !== shareSpaceId))) &&
    !isIframe()
  );

  const singleFormShare = formId && nodeTree?.nodeId === formId;

  const isIframeShowSharemenu = nodeTree?.children?.length === 0 && isIframe();

  return (
    <ShareContext.Provider value={{ shareInfo: shareSpace }}>
      <Head>
        <meta property='og:title' content={shareInfo?.shareNodeName || t(Strings.og_site_name_content)} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:image' content='https://s1.vika.cn/space/2021/12/01/992611616a744743a75c4b916e982dd6' />
        <meta property='og:site_name' content={t(Strings.og_site_name_content)} />
        <meta property='og:description' content={t(Strings.og_product_description_content)} />
      </Head>
      <div
        className={classNames(styles.share, {
          [styles.hiddenCatalog]: !sideBarVisible,
          [styles.formShare]: formId && nodeTree?.nodeId !== formId, // The form is shared through a folder
          [styles.iframeShare]: !isIframe(),
          [styles.iframeShareContainer]: isIframe(),
        })}
      >
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          {singleFormShare ? (
            <FormPanel loading={loading} />
          ) : !isIframeShowSharemenu ? (
            <SplitPane
              split='vertical'
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
              <ComponentWrapper
                isIframeShowSharemenu={isIframeShowSharemenu}
                shareId={shareId}
                sideBarVisible={sideBarVisible}
                judgeAllowEdit={judgeAllowEdit}
                shareSpaceId={shareSpaceId}
                applicationJoinAlertVisible={applicationJoinAlertVisible}
                shareSpace={shareSpace}
                shareSpaceName={shareSpaceName}
              >
                {component}
              </ComponentWrapper>
            </SplitPane>
          ) : <ComponentWrapper
            isIframeShowSharemenu={isIframeShowSharemenu}
            shareId={shareId}
            sideBarVisible={sideBarVisible}
            judgeAllowEdit={judgeAllowEdit}
            shareSpaceId={shareSpaceId}
            applicationJoinAlertVisible={applicationJoinAlertVisible}
            shareSpace={shareSpace}
            shareSpaceName={shareSpaceName}
          >
            {component}
          </ComponentWrapper>}
        </ComponentDisplay>
        {isIframe() && <div className={styles.brandContainer}>
          <img src={integrateCdnHost(Settings.share_iframe_brand.value)} alt='vika_brand' />
        </div>}
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
