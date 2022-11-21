import { findNode, Navigation, Selectors, StoreActions, Strings, t, Settings, integrateCdnHost, IEmbedInfo } from '@apitable/core';
import classNames from 'classnames';
import Head from 'next/head';
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { usePageParams, useSideBarVisible, useUserRequest, useRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import Openup from 'static/icon/workbench/openup.svg';
import Packup from 'static/icon/workbench/packup.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { DataSheetPane } from '../datasheet_pane';
import { FolderShowcase } from '../folder_showcase';
import { ShareMenu } from '../share/share_menu';
import { INodeTree } from '../share/interface';
import { ShareFail } from '../share/share_fail';
import styles from '../share/style.module.less';

interface IEmbedProps {
  embedInfo: any | undefined;
}

const Embed: React.FC<IEmbedProps> = ({ embedInfo }) => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();

  const { datasheetId, folderId } = useSelector(state => state.pageParams);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const [nodeTree, setNodeTree] = useState<INodeTree>();
  const [visible, setVisible] = useState(false);
  const [embedClose, setEmbedClose] = useState(false);
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const dispatch = useAppDispatch();
  const [embedConfig, setEmbedCofig] = useState<IEmbedInfo>();

  usePageParams();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  useEffect(() => {
    if (!embedInfo) {
      return;
    }

    if (!embedInfo.hasLogin) {
      dispatch(StoreActions.setLoading(false));
      return;
    }
    getLoginStatus({ spaceId: embedInfo.spaceId }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedInfo]);

  useEffect(() => {
    if (!embedInfo) {
      setEmbedClose(true);
      return;
    }
    const { 
      nodeId, 
      shareNodeName = '"新建维格表 4"', 
      embedNodeType = 2, 
      nodeTree = [], 
      shareNodeIcon = '', 
      payload: embedSetting, 
      ...embedSpaceInfo 
    } = embedInfo;

    setSideBarVisible(false);
    setNodeTree({
      nodeId,
      nodeName: shareNodeName,
      type: embedNodeType,
      icon: shareNodeIcon,
      children: nodeTree,
    });

    setEmbedCofig(embedSetting);
    if (embedInfo.isFolder && nodeTree.length === 0) {
      return;
    }

    dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([...nodeTree, { nodeId, nodeName: shareNodeName, icon: shareNodeIcon }])));
    dispatch(StoreActions.fetchMarketplaceApps(embedSpaceInfo.spaceId as string));

    dispatch(StoreActions.setEmbedInfo({ ...embedSetting }));
    if (datasheetId) {
      return;
    }
    setTimeout(() => {
      console.log('share navigationTo');
      Router.push(Navigation.EMBED_SPACE,{
        params: { embedId: embedSpaceInfo.linkId, nodeId },
      });
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(embedInfo)]);

  // Embed Close
  if (embedClose) {
    return <ShareFail />;
  }

  const handleClick = () => {
    setSideBarVisible(!sideBarVisible);
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
        <meta property='og:title' content={embedInfo?.shareNodeName || '维格表'} />
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
              {sideBarVisible && (
                <ShareMenu shareSpace={embedInfo} shareNode={nodeTree} visible={visible} setVisible={setVisible} loading={loading} />
              )}
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
      </div>
    </>
  );
};

export default Embed;