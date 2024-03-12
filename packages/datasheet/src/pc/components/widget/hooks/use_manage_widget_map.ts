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

import { usePrevious } from 'ahooks';
import { difference } from 'lodash';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { ResourceType, Selectors, StoreActions, IWidgetPanelStatus } from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { setStorage, StorageName } from 'pc/utils/storage/storage';

export const useManageWidgetMap = () => {
  const dispatch = useAppDispatch();
  const { datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const resourceId = mirrorId || datasheetId;
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
  const activeWidgetPanel = useAppSelector((state) => Selectors.getResourceActiveWidgetPanel(state, resourceId!, resourceType));

  const activeWidgetInPanelIds = useMemo(() => {
    if (!activeWidgetPanel) {
      return [];
    }
    // Here the array needs to be sorted to avoid the effects of drag-and-drop sorting.
    return activeWidgetPanel.widgets
      .map((item) => {
        return item.id;
      })
      .sort();
  }, [activeWidgetPanel]);

  const previousActiveWidgetInPanelIds = usePrevious(activeWidgetInPanelIds);

  useEffect(() => {
    if (shallowEqual(previousActiveWidgetInPanelIds, activeWidgetInPanelIds)) {
      return;
    }
    const increaseDiff = difference(activeWidgetInPanelIds, previousActiveWidgetInPanelIds || []);
    const reduceDiff = difference(previousActiveWidgetInPanelIds || [], activeWidgetInPanelIds);

    if (increaseDiff.length) {
      dispatch(StoreActions.fetchWidgetsByWidgetIds(increaseDiff));
    }
    if (reduceDiff.length) {
      dispatch(StoreActions.resetWidget(reduceDiff));
    }
  }, [previousActiveWidgetInPanelIds, activeWidgetInPanelIds, dispatch, datasheetId]);
};

export const useMountWidgetPanelShortKeys = () => {
  const dispatch = useDispatch();
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { datasheetId, mirrorId } = useAppSelector(
    (state) => ({
      datasheetId: state.pageParams.datasheetId,
      mirrorId: state.pageParams.mirrorId,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const toggleWidgetPanel = () => {
      const state = store.getState();
      const isApiPanelOpen = state.space.isApiPanelOpen;
      if (isApiPanelOpen) {
        dispatch(StoreActions.toggleApiPanel(false));
      }
      const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
      const spaceId = state.space.activeId;
      const resourceId = mirrorId || datasheetId || '';
      const { width, opening, activePanelId } = Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || ({} as IWidgetPanelStatus);
      setStorage(StorageName.WidgetPanelStatusMap, {
        [`${spaceId},${resourceId}`]: {
          width,
          opening: !opening,
          activePanelId,
        },
      });
      dispatch(StoreActions.toggleWidgetPanel(resourceId!, resourceType));
    };
    ShortcutActionManager.bind(ShortcutActionName.ToggleWidgetPanel, toggleWidgetPanel);
  }, [datasheetId, spaceId, dispatch, mirrorId]);
};
