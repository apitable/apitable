import { useThemeColors } from '@vikadata/components';
import { AutoTestID, Events, findNode, IReduxState, ITemplateDirectory, Navigation, Player, Selectors, Settings, StoreActions } from '@apitable/core';
import { useMount, useRequest, useUnmount } from 'ahooks';
import { openTryoutSku } from 'dingtalk-design-libs';
import dd from 'dingtalk-jsapi';
import { Loading } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { CommonSide } from 'pc/components/common_side';
import { DashboardPanel } from 'pc/components/dashboard_panel';
import { DataSheetPane } from 'pc/components/datasheet_pane';
import { FolderShowcase } from 'pc/components/folder_showcase';
import { FormPanel } from 'pc/components/form_panel';
import { isDingtalkSkuPage } from 'pc/components/home/social_platform';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useResponsive, useSideBarVisible, useTemplateRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import styles from './style.module.less';

export const TemplateDetail: FC = () => {
  const colors = useThemeColors();
  const router = useRouter();
  const { sideBarVisible: _sideBarVisible } = useSideBarVisible();
  const pageParams = useSelector((state: IReduxState) => state.pageParams);
  const { datasheetId, folderId, templateId, categoryId, formId, dashboardId, mirrorId } = pageParams;

  const spaceId = useSelector(state => state.space.activeId);
  const activeNodeId = useSelector((state: IReduxState) => Selectors.getNodeId(state));
  const { getTemplateDirectoryReq } = useTemplateRequest();
  const { run: getTemplateDirectory } = useRequest<ITemplateDirectory, any[]>(getTemplateDirectoryReq, { manual: true });
  const templateDirectory = useSelector(state => state.templateCentre.directory);
  const dispatch = useAppDispatch();
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
    // Whether it is a space template
    const isPrivate = categoryId === 'tpcprivate';
    getTemplateDirectory(templateId, isPrivate, categoryId);
    // Use the spaceId of the official template space in the configuration table under the official template to query
    if (templateId && categoryId !== 'tpcprivate') {
      dispatch(StoreActions.fetchMarketplaceApps(Settings.template_space_id.value));
    }
  }, [templateId, getTemplateDirectory, categoryId, dispatch, spaceId]);

  useEffect(() => {
    if (mirrorId || activeNodeId) {
      return;
    }
    const routerTemplateId = get(router.query, 'template_id.0') as string;
    Router.replace(Navigation.TEMPLATE, {
      params: {
        spaceId,
        categoryId,
        templateId: templateId || routerTemplateId,
        nodeId: datasheetId || activeNodeId || templateDirectory?.nodeTree.nodeId || '',
      },
    });
  }, [mirrorId, categoryId, datasheetId, spaceId, templateDirectory, templateId, activeNodeId]);

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

  // In the Dingtalk, open the trial pop-up window, open it and jump to the home page to try
  const openSku = () => {
    if (!isSkuPage || !corpId || !purchaseToken) return;

    openTryoutSku({
      corpId,
      appId: appId ? Number(appId) : undefined,
      token: purchaseToken,
    })
      .then((res: any) => {
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
      })
      .catch(err => {});
  };

  const MainComponent = () => {
    if (!templateDirectory) {
      return <Loading />;
    }

    return (
      <div className={styles.right} style={{ borderLeft: !sideBarVisible ? `16px solid ${colors.blackBlue[900]}` : '' }} onClick={openSku}>
        <div className={styles.content} style={{ pointerEvents: isSkuPage ? 'none' : 'auto' }}>
          {templateDirectory && getComponent()}
        </div>
      </div>
    );
  };

  return (
    <div id={AutoTestID.TEMPLATE_DETAIL_CONTAINER} className={styles.templateDetailWrapper}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <SplitPane
          split='vertical'
          minSize={templateId ? 320 : 280}
          defaultSize={defaultSize}
          maxSize={800}
          style={{ overflow: 'hidden' }}
          size={!sideBarVisible ? 0 : defaultSize}
          allowResize={sideBarVisible}
          resizerStyle={{ backgroundColor: colors.blackBlue[900] }}
        >
          {isSkuPage ? <div /> : <CommonSide />}
          {MainComponent()}
        </SplitPane>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.mobile}>{MainComponent()}</div>
      </ComponentDisplay>
    </div>
  );
};
