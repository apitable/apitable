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

import { useCounter } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResourceType, Selectors } from '@apitable/core';
import { loadWidgetCheck, WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { useUrlQuery } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { closeWidgetRoute, expandWidgetRoute, IWidgetFullScreenType } from '../expand_widget';

export * from './use_manage_widget_map';

export const useResourceManageable = () => {
  const { manageable } = useAppSelector((state) => {
    const { dashboardId, datasheetId } = state.pageParams;
    const resourceType = dashboardId ? ResourceType.Dashboard : ResourceType.Datasheet;
    const resourceId = dashboardId || datasheetId!;
    return Selectors.getResourcePermission(state, resourceId, resourceType);
  });
  return manageable;
};

export const useDevLoadCheck = (
  widgetId: string,
  isDevMode?: boolean,
): [boolean, boolean, WidgetLoadError | undefined, (delta?: number | undefined) => void] => {
  const [devSandbox, setDevSandbox] = useState<boolean>(false);
  const [devSandboxLoading, setDevSandboxLoading] = useState<boolean>(false);
  const widget = useAppSelector((state) => Selectors.getWidget(state, widgetId));
  const widgetPackageId = widget?.widgetPackageId;
  const devWidgetUrl = widget && widget.widgetPackageId && widget.snapshot.storage[`widget_loader_code_url_${widget.widgetPackageId}`];
  const [error, setError] = useState<WidgetLoadError>();
  const [count, { inc: refreshVersion }] = useCounter(0);
  useEffect(() => {
    setError(undefined);
    if (isDevMode && devWidgetUrl && widgetPackageId) {
      setDevSandboxLoading(true);
      loadWidgetCheck(devWidgetUrl, widgetPackageId)
        .then((res) => {
          setDevSandbox(Boolean(res.sandbox));
          setDevSandboxLoading(false);
        })
        .catch((error) => {
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
