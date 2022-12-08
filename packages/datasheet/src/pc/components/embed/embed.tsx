import { findNode, Navigation, Selectors, StoreActions, Strings, t, Settings, integrateCdnHost, IEmbedInfo, ConfigConstant, PermissionType } from '@apitable/core';
import classNames from 'classnames';
import Head from 'next/head';
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { usePageParams, useSideBarVisible, useRequest, useSpaceRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import Openup from 'static/icon/workbench/openup.svg';
import Packup from 'static/icon/workbench/packup.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { DataSheetPane } from '../datasheet_pane';
import { FolderShowcase } from '../folder_showcase';
import { INodeTree } from '../share/interface';
import styles from './style.module.less';
import { EmbedFail } from './embed_fail';
import { Button } from '@apitable/components';
import { CloseLargeOutlined } from '@apitable/icons';
interface IEmbedProps {
  embedId: string;
}

const Embed: React.FC<IEmbedProps> = (embedProps) => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const { embedId } = embedProps;
  const { datasheetId, folderId } = useSelector(state => state.pageParams);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const [nodeTree, setNodeTree] = useState<INodeTree>();

  const [embedClose, setEmbedClose] = useState(false);
  const { getEmbedInfoReq } = useSpaceRequest();
 
  const dispatch = useAppDispatch();
  const [embedConfig, setEmbedCofig] = useState<IEmbedInfo>();
  const { data: embedData } = useRequest<any>(() => getEmbedInfoReq(embedId));
  const isLogin = useSelector(state => state.user.isLogin);
  const [isShowLoginButton, setIsShowLoginButton] = useState<boolean>(true);

  usePageParams();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  useEffect(() => {
    if (!embedData) {
      setEmbedClose(true);
      return;
    } 
    setEmbedClose(false);
    const { embedInfo, nodeInfo, spaceId } = embedData;
    const {  
      nodeTree = [], 
      shareNodeIcon = '', 
      payload: embedSetting, 
      linkId
    } = embedInfo;

    const { nodeName, id: nodeId, icon } = nodeInfo;

    setSideBarVisible(false);
    setNodeTree({
      nodeId,
      nodeName,
      type: ConfigConstant.NodeType.DATASHEET,
      icon: icon,
      children: nodeTree,
    });

    setEmbedCofig(embedSetting);
    if (embedInfo.isFolder && nodeTree.length === 0) {
      return;
    }

    dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([...nodeTree, { nodeId, nodeName, icon: shareNodeIcon }])));
    dispatch(StoreActions.fetchMarketplaceApps(spaceId as string));

    dispatch(StoreActions.setEmbedInfo({ ...embedSetting }));
    if (datasheetId) {
      return;
    }
    setTimeout(() => {
      Router.push(Navigation.EMBED_SPACE,{
        params: { embedId: linkId, nodeId, viewId: embedSetting.viewControl.viewId },
      });
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(embedData)]);

  // Embed Close
  if (embedClose) {
    return <EmbedFail />;
  }

  const handleClick = () => {
    setSideBarVisible(!sideBarVisible);
  };

  const loginHandler = () => {
    const reference = window.location.href;
    Router.redirect(Navigation.LOGIN, { query: { reference }});
  };

  const getComponent = () => {
    if (!nodeTree) {
      return;
    }
    if (datasheetId) {
      return <DataSheetPane />;
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

  const localSize = localStorage.getItem('splitPos');
  const defaultSize = localSize ? parseInt(localSize, 10) : 320;
  const closeBtnClass = classNames({
    [styles.closeBtn]: true,
    [styles.isPanelClose]: !sideBarVisible,
  });

  const closeBtnStyles: React.CSSProperties = {};

  const DataSheetComponent = () => {
    return(
      <div
        className={classNames(styles.gridContainer, {
          // [styles.containerAfter]: !isIframe(),
          [styles.iframeShareContainer]: true,
        })}
        style={{
          height: '100%',
          paddingBottom: embedConfig?.bannerLogo ? '40px' : '',
        }}
      >
        <div className={styles.wrapper}>
          {getComponent()}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <meta property='og:title' content={embedData?.nodeInfo?.nodeName || '维格表'} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:image' content='https://s1.vika.cn/space/2021/12/01/992611616a744743a75c4b916e982dd6' />
        <meta property='og:site_name' content='维格表' />
        <meta property='og:description' content='维格表, 积木式多媒体数据表格, 维格表技术首创者, 数据整理神器, 让人人都是数据设计师' />
      </Head>
      <div
        className={classNames(styles.share, {
          [styles.hiddenCatalog]: !sideBarVisible,
          [styles.iframeShareContainer]: true
        })}
      >
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
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
              <Tooltip
                title={!sideBarVisible ? t(Strings.expand_pane) : t(Strings.hide_pane)}
                placement={!sideBarVisible ? 'right' : 'bottom'}
                offset={[0, 0]}
              >
                { sideBarVisible && <div className={closeBtnClass} style={closeBtnStyles} onClick={handleClick}>
                  {!sideBarVisible ? <Openup width={16} height={16} /> : <Packup width={16} height={16} />}
                </div> }
              </Tooltip>
            </div>
            <DataSheetComponent />
          </SplitPane>
        </ComponentDisplay>
        { embedConfig?.bannerLogo && <div className={styles.brandContainer} >
          <img src={integrateCdnHost(Settings.share_iframe_brand.value)} alt="vika_brand" />
        </div>}
        { !isLogin && embedConfig?.permissionType === PermissionType.PUBLICEDIT && isShowLoginButton &&
          <div className={styles.loginButton} >
            <p>登录后可编辑</p>
            <Button
              color='primary'
              size='small'
              className={styles.applicationBtn}
              onClick={loginHandler}
            >登录</Button>
            {/* <div  >
              
            </div> */}
            <CloseLargeOutlined className={styles.closeBtn} onClick={() => setIsShowLoginButton(false)} />
          </div>
        }
      </div>
    </>
  );
};

export default Embed;