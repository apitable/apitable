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

import { ResourceType, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let paramsDashboardId: string | undefined;

store.subscribe(() => {
  const state = store.getState();

  const spaceId = state.space.activeId || state.share.spaceId || state.embedInfo?.spaceId;

  if (!spaceId && !state.pageParams.shareId && !state.pageParams.templateId && !state.pageParams.embedId) {
    return;
  }

  if (state.pageParams.embedId && (!spaceId || !resourceService.instance?.initialized)) {
    return;
  }

  const previousParamsDashboardId = paramsDashboardId;
  paramsDashboardId = state.pageParams.dashboardId;

  if (paramsDashboardId === previousParamsDashboardId) {
    return;
  }

  if (!paramsDashboardId) {
    return;
  }

  if (!paramsDashboardId && previousParamsDashboardId) {
    // TODO: Destroy Dashboard
    return;
  }

  const widgetMapKey = Object.keys(state.widgetMap);

  if (widgetMapKey.length) {
    store.dispatch(StoreActions.resetWidget(widgetMapKey));
  }

  resourceService.instance?.initialized &&
    resourceService.instance?.switchResource({
      from: previousParamsDashboardId,
      to: paramsDashboardId!,
      resourceType: ResourceType.Dashboard,
    });
});
