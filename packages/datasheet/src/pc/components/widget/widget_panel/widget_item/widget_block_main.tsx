import { useMount, useUnmount } from 'ahooks';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { Selectors, StoreActions } from '@apitable/core';
import {
  eventMessage,
  getLanguage,
  IExpandRecordProps,
  initRootWidgetState,
  initWidgetStore,
  MessageType,
  RuntimeEnv,
  WidgetProvider,
  ErrorMessage,
} from '@apitable/widget-sdk';
import { WidgetLoader } from 'widget-stage/main/widget/widget_loader';
import { dashboardReg } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getDependenceByDstIdsByGlobalResource } from 'pc/utils/dependence_dst';
import { useCloudStorage } from '../../hooks/use_cloud_storage';
import { expandWidgetDevConfig } from '../../widget_center/widget_create_modal';
import { patchDatasheet } from './utils';
import { IWidgetBlockRefs } from './widget_block';
import { WidgetLoading } from './widget_loading';

export const WidgetBlockMainBase: React.ForwardRefRenderFunction<
  IWidgetBlockRefs,
  {
    widgetId: string;
    widgetPackageId: string;
    isExpandWidget: boolean;
    isSettingOpened: boolean;
    toggleSetting(state?: boolean | undefined): any;
    toggleFullscreen(state?: boolean | undefined): any;
    expandRecord(props: IExpandRecordProps): any;
    nodeId: string;
    isDevMode?: boolean;
    runtimeEnv: RuntimeEnv;
  }
> = (props, ref) => {
  const { widgetId, widgetPackageId, runtimeEnv, isExpandWidget, isSettingOpened, toggleSetting, toggleFullscreen, expandRecord, isDevMode, nodeId } =
    props;
  const theme = useSelector((state) => state.theme);
  const [codeUrl, setCodeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`, widgetId);
  const [widgetStore, setWidgetStore] = useState<any>();
  const errorCode = useSelector((state) => {
    const widget = Selectors.getWidget(state, widgetId)!;
    const { sourceId, datasheetId } = widget.snapshot;
    return sourceId?.startsWith('mir') ? Selectors.getMirrorErrorCode(state, sourceId) : Selectors.getDatasheetErrorCode(state, datasheetId);
  });

  const dashboardConnected = useSelector((state) => {
    try {
      const dashboardId = state.pageParams.dashboardId;
      if (!dashboardId) {
        return false;
      }
      return Selectors.getDashboardPack(state, nodeId)?.connected;
    } catch (error) {
      return false;
    }
  });

  const nodeConnected = useSelector((state) => {
    const datasheet = Selectors.getDatasheet(state, nodeId);
    const bindDatasheetLoaded = datasheet && !datasheet.isPartOfData;
    // The initialization of the widget must be done after the datasheet loaded.
    if (!bindDatasheetLoaded) {
      return false;
    }
    const { templateId, nodeId: pageNodeId } = state.pageParams;
    // dashboard in
    if (pageNodeId && dashboardReg.test(pageNodeId)) {
      return Selectors.getDashboardPack(state, nodeId)?.connected;
    }
    return templateId || nodeId !== pageNodeId || Selectors.getDatasheetPack(state, nodeId)?.connected;
  });

  useImperativeHandle(ref, () => ({
    refresh: () => eventMessage.refreshWidget(widgetId),
    setCodeUrl,
    codeUrl,
  }));

  const expandDevConfig = () =>
    expandWidgetDevConfig({
      codeUrl,
      widgetPackageId,
      widgetId,
      onConfirm: (devUrl) => {
        setCodeUrl?.(devUrl);
      },
    });

  useMount(() => {
    eventMessage.mountWidget(widgetId);
  });

  useUnmount(() => {
    eventMessage.unMounted(widgetId);
  });

  useEffect(() => {
    if (!nodeConnected) {
      return;
    }
    const state = store.getState();
    const datasheetId = Selectors.getWidgetSnapshot(state, widgetId)?.datasheetId;
    if (!datasheetId) {
      throw new Error("Unexpected errors: Can't get the datasheetId bound by the widget");
    }
    const computeRefManager = resourceService.instance.computeRefManager;
    const foreignDatasheetIds = getDependenceByDstIdsByGlobalResource(state, datasheetId, computeRefManager);
    const widgetStore = initWidgetStore(initRootWidgetState(state, widgetId, { foreignDatasheetIds }), widgetId);
    setWidgetStore(widgetStore);
  }, [widgetId, nodeConnected, dashboardConnected]);

  useEffect(() => {
    eventMessage.onSyncCmdOptions(widgetId, async(res) => {
      eventMessage.syncCmdOptionsResult(widgetId, await resourceService.instance!.commandManager.execute(res));
    });

    eventMessage.onFetchDatasheet(widgetId, (fetchDatasheet, messageId) => {
      patchDatasheet({
        ...fetchDatasheet,
        widgetId,
        messageId,
      });
    });

    eventMessage.onSyncWidgetSubscribeView(widgetId, (newsSubscribeViews) => {
      const state = store.getState();
      newsSubscribeViews.forEach(({ datasheetId, viewId }) => {
        if (!Selectors.getViewDerivatePrepared(state, datasheetId, viewId)) {
          store.dispatch(StoreActions.triggerViewDerivationComputed(datasheetId, viewId));
          return;
        }
        eventMessage.syncAction(
          StoreActions.setViewDerivation(datasheetId, {
            viewId: Selectors.getViewIdByNodeId(state, datasheetId, viewId)!,
            viewDerivation: Selectors.getViewDerivation(state, datasheetId, viewId),
          }),
          widgetId,
        );
      });
    });

    return () => {
      eventMessage.removeListenEvent(widgetId, MessageType.WIDGET_SYNC_COMMAND);
      eventMessage.removeListenEvent(widgetId, MessageType.WIDGET_FETCH_VIEW);
      eventMessage.removeListenEvent(widgetId, MessageType.WIDGET_FETCH_DATASHEET);
      eventMessage.removeListenEvent(widgetId, MessageType.WIDGET_SUBSCRIBE_CHANGE);
    };
  }, [widgetId]);

  useEffect(() => {
    if (widgetStore) {
      // Handling updates action.
      eventMessage.onSyncAction(widgetId, (action) => {
        widgetStore.dispatch(action);
      });
    }

    return () => {
      eventMessage.removeListenEvent(widgetId, MessageType.MAIN_SYNC_ACTION);
    };
  }, [widgetId, widgetStore]);

  if (errorCode) {
    return <ErrorMessage errorCode={errorCode} themeName={theme} />;
  }

  if (!nodeConnected || !widgetStore) {
    return <WidgetLoading />;
  }

  return (
    <WidgetProvider
      id={widgetId}
      locale={getLanguage()}
      theme={theme}
      runtimeEnv={runtimeEnv}
      widgetStore={widgetStore}
      isFullscreen={isExpandWidget}
      isShowingSettings={isSettingOpened}
      toggleSettings={toggleSetting}
      toggleFullscreen={toggleFullscreen}
      expandRecord={expandRecord}
    >
      <WidgetLoader expandDevConfig={expandDevConfig} isDevMode={Boolean(isDevMode)} />
    </WidgetProvider>
  );
};

export const WidgetBlockMain = React.forwardRef(WidgetBlockMainBase);
