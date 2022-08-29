import { useThemeColors } from '@vikadata/components';
import {
  AutoTestID, ConfigConstant, Events, findNode, IReduxState, ITemplateDirectory, ITemplateTree, Navigation, Player, Selectors, Settings, StoreActions,
} from '@vikadata/core';
import { useMount, useRequest, useUnmount } from 'ahooks';
import { Tree } from 'antd';
import { openTryoutSku } from 'dingtalk-design-libs';
import dd from 'dingtalk-jsapi';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { Loading } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { CommonSide } from 'pc/components/common_side';
import { DashboardPanel } from 'pc/components/dashboard_panel';
import { FolderShowcase } from 'pc/components/folder_showcase';
import { FormPanel } from 'pc/components/form_panel';
import { isDingtalkSkuPage } from 'pc/components/home/social_platform';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { INodeTree } from 'pc/components/share';
import { useQuery, useResponsive, useSideBarVisible, useTemplateRequest } from 'pc/hooks';
import { FC, ReactText, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import PullDownIcon from 'static/icon/common/common_icon_pulldown.svg';
import { DataSheetPane } from '../../datasheet_pane';
import styles from './style.module.less';

const { DirectoryTree, TreeNode } = Tree;

export const TemplateDetail: FC = () => {
  const colors = useThemeColors();
  const { sideBarVisible: _sideBarVisible } = useSideBarVisible();
  const {
    datasheetId, folderId, templateId, categoryId, formId, dashboardId, mirrorId,
  } = useSelector((state: IReduxState) => state.pageParams);
  const spaceId = useSelector(state => state.space.activeId);
  const activeNodeId = useSelector((state: IReduxState) => Selectors.getNodeId(state));
  const navigationTo = useNavigation();
  const { getTemplateDirectoryReq } = useTemplateRequest();
  const { run: getTemplateDirectory } = useRequest<ITemplateDirectory, any[]>(getTemplateDirectoryReq, { manual: true });
  const templateDirectory = useSelector(state => state.templateCentre.directory);
  const dispatch = useDispatch();
  const query = useQuery();
  const appId = query.get('appId') || '';
  const corpId = query.get('corpId') || '';
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage(purchaseToken);
  const sideBarVisible = !isSkuPage && _sideBarVisible;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMount(() => {
    Player.doTrigger(Events.template_detail_shown);
    openSku();
  });

  useUnmount(() => {
    dispatch(StoreActions.updateTemplateDirectory(null));
  });

  useEffect(() => {
    if (!templateId) {
      return;
    }
    // 判断是否是空间站模板
    const isPrivate = categoryId === 'tpcprivate';
    getTemplateDirectory(templateId, isPrivate, categoryId);
    // vika 官方模板下使用配置表中的官方模板空间的 spaceId 查询
    if (templateId && categoryId !== 'tpcprivate') {
      dispatch(StoreActions.fetchMarketplaceApps(Settings.template_space_id.value));
    }

  }, [templateId, getTemplateDirectory, categoryId, dispatch, spaceId]);

  useEffect(() => {
    if (mirrorId || activeNodeId) {
      return;
    }
    navigationTo({
      path: Navigation.TEMPLATE,
      params: {
        spaceId,
        categoryId,
        templateId,
        nodeId: datasheetId || activeNodeId || templateDirectory?.nodeTree.nodeId || '',
      },
      method: Method.Replace,
    });
  }, [mirrorId, categoryId, datasheetId, navigationTo, spaceId, templateDirectory, templateId, activeNodeId]);

  const getComponent = () => {
    if (!templateDirectory || !templateId) {
      return;
    }
    if (mirrorId) {
      return <MirrorRoute />;
    } else if (datasheetId) {
      return <DataSheetPane />;
    } else if (formId) {
      return <FormPanel />;
    } else if (dashboardId) {
      return <DashboardPanel />;
    } else if (folderId) {
      const parentNode = findNode([templateDirectory.nodeTree], folderId);
      const childNodes = (parentNode && parentNode.children) ?? [];
      return (
        <FolderShowcase
          nodeInfo={{
            icon: templateDirectory.nodeTree.icon,
            name: templateDirectory.nodeTree.nodeName,
            id: templateDirectory.nodeTree.nodeId,
          }}
          readOnly
          childNodes={childNodes}
        />
      );
    }
    return;
  };

  const localSize = localStorage.getItem('splitPos');
  let defaultSize = localSize ? parseInt(localSize, 10) : 280;
  defaultSize = templateId ? 320 : defaultSize;

  // 钉钉中，打开试用弹窗，开通后跳转到首页试用
  const openSku = () => {
    if (!isSkuPage || !corpId || !purchaseToken) return;

    openTryoutSku({
      corpId,
      appId: appId ? Number(appId) : undefined,
      token: purchaseToken,
    }).then((res: any) => {
      const { action, corpId } = res;

      if (action === 'ok') {
        const url = new URL(window.location.origin);

        url.pathname = '/user/dingtalk/social_bind_space';
        url.searchParams.set('corpId', corpId);
        url.searchParams.set('suiteId', '19704002');
        url.searchParams.set('ddtab', 'true');

        if (isMobile) {
          dd.biz.util.openLink({ url: url.href }).then(() => dd.biz.navigation.close({}));
        } else {
          window.location.href = url.href;
        }
      }
    }).catch((err) => {});
  };

  const MainComponent = () => {
    if (!templateDirectory) {
      return <Loading />;
    }

    return (
      <div
        className={styles.right}
        style={{ borderLeft: !sideBarVisible ? `16px solid ${colors.blackBlue[900]}` : '' }}
        onClick={openSku}
      >
        <div
          className={styles.content}
          style={{ pointerEvents: isSkuPage ? 'none' : 'auto' }}
        >
          {templateDirectory && getComponent()}
        </div>
      </div>
    );
  };

  return (
    <div id={AutoTestID.TEMPLATE_DETAIL_CONTAINER} className={styles.templateDetailWrapper}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <SplitPane
          split="vertical"
          minSize={templateId ? 320 : 280}
          defaultSize={defaultSize}
          maxSize={800}
          style={{ overflow: 'hidden' }}
          size={!sideBarVisible ? 0 : defaultSize}
          allowResize={sideBarVisible}
          resizerStyle={{ backgroundColor: colors.blackBlue[900] }}
        >
          {
            isSkuPage ?
              <div /> :
              <CommonSide />
          }
          {MainComponent()}
        </SplitPane>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.mobile}>
          {MainComponent()}
        </div>
      </ComponentDisplay>
    </div>
  );
};

interface INodeTreeProps {
  nodeTree: ITemplateTree;
}

export const NodeTree: FC<INodeTreeProps> = props => {
  const colors = useThemeColors();
  const { nodeTree } = props;
  const nodeId = useSelector(state => Selectors.getNodeId(state))!;
  const { templateId, categoryId } = useSelector((state: IReduxState) => state.pageParams);
  const spaceId = useSelector(state => state.space.activeId);
  const navigationTo = useNavigation();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const { setSideBarVisible } = useSideBarVisible();

  if (!nodeTree) {
    return <></>;
  }

  function onSelect(selectedKeys: ReactText[]) {
    const [dsId] = selectedKeys;
    navigationTo({
      path: Navigation.TEMPLATE,
      params: {
        spaceId,
        templateId,
        categoryId,
        nodeId: dsId as string,
      },
    });
    isMobile && setSideBarVisible(false);
  }

  const renderNode = (node: INodeTree[] | undefined, colors) => {
    if (!node || !node.length) {
      return <></>;
    }
    return node!.map(item => {
      const icon = getNodeIcon(item.icon, item.type, { size: 16, emojiSize: 18, actived: item.nodeId === nodeId, normalColor: colors.defaultBg });
      if (item.type === ConfigConstant.NodeType.FOLDER) {
        return (
          <TreeNode
            title={item.nodeName}
            key={item.nodeId}
            style={{ width: '100%' }}
            icon={icon}
          >
            {renderNode(item.children, colors)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.nodeName}
          key={item.nodeId}
          style={{ width: '100%' }}
          isLeaf
          icon={icon}
        />
      );
    });
  };
  return (
    <DirectoryTree
      defaultExpandAll
      onSelect={onSelect}
      switcherIcon={<span><PullDownIcon /></span>}
      selectedKeys={[nodeId]}
      expandAction={false}
    >
      {renderNode([nodeTree], colors)}
    </DirectoryTree>
  );
};
