import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadWidgetCheck, WidgetLoadError } from '@vikadata/widget-sdk/dist/initialize_widget';
import { ResourceType, Selectors } from '@apitable/core';
import { useSelector } from 'react-redux';
import { useCounter } from 'ahooks';
import { useUrlQuery } from 'pc/hooks';
import { closeWidgetRoute, expandWidgetRoute, IWidgetFullScreenType } from '../expand_widget';

export * from './use_manage_widget_map';

export const useResourceManageable = () => {
  const { manageable } = useSelector((state) => {
    const { dashboardId, datasheetId } = state.pageParams;
    const resourceType = dashboardId ? ResourceType.Dashboard : ResourceType.Datasheet;
    const resourceId = dashboardId || datasheetId!;
    return Selectors.getResourcePermission(state, resourceId, resourceType);
  });
  return manageable;
};

export const useDevLoadCheck = (
  widgetId: string, isDevMode?: boolean):
  [boolean, boolean, WidgetLoadError | undefined, (delta?: number | undefined) => void] => {
  const [devSandbox, setDevSandbox] = useState<boolean>(false);
  const [devSandboxLoading, setDevSandboxLoading] = useState<boolean>(false);
  const widget = useSelector(state => Selectors.getWidget(state, widgetId));
  const widgetPackageId = widget?.widgetPackageId;
  const devWidgetUrl = widget && widget.widgetPackageId && widget.snapshot.storage[`widget_loader_code_url_${widget.widgetPackageId}`];
  const [error, setError] = useState<WidgetLoadError>();
  const [count, { inc: refreshVersion }] = useCounter(0);
  useEffect(() => {
    setError(undefined);
    if (isDevMode && devWidgetUrl && widgetPackageId) {
      setDevSandboxLoading(true);
      loadWidgetCheck(devWidgetUrl, widgetPackageId).then(res => {
        setDevSandbox(Boolean(res.sandbox));
        setDevSandboxLoading(false);
      }).catch((error) => {
        setError(error);
        setDevSandboxLoading(false);
      });
    }
  }, [widgetPackageId, devWidgetUrl, isDevMode, setDevSandbox, setDevSandboxLoading, count]);

  const refresh = useCallback(() => {
    refreshVersion();
    setError(undefined);
  }, [refreshVersion, setError]);

  return useMemo(() => {
    return [devSandbox, devSandboxLoading, error, refresh];
  }, [devSandbox, devSandboxLoading, error, refresh]);
};

export const useFullScreen = (widgetId: string): [boolean, () => void] => {
  const query = useUrlQuery();
  const isFullScreen = query['widgetFullScreen'] === IWidgetFullScreenType.Full;

  return useMemo(() => {
    const toggleFullScreenWidget = () => {
      isFullScreen ? closeWidgetRoute(widgetId, IWidgetFullScreenType.Normal) : expandWidgetRoute(widgetId, false, IWidgetFullScreenType.Full);
    };
    return [isFullScreen, toggleFullScreenWidget];
  }, [isFullScreen, widgetId]);
};
