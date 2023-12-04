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

import { useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { IWidgetPanelStatus, ResourceType, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { EXPAND_WIDGET } from '../components/widget/expand_widget';

export const useExpandWidget = () => {
  const { widgetId, datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const dispatch = useDispatch();

  const openWidgetPanel = useCallback(() => {
    if (!datasheetId) {
      return;
    }
    const state = store.getState();
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    const widgetPanelStatus = Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || ({} as IWidgetPanelStatus);
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const widgetPanels = snapshot?.meta.widgetPanels;
    if (!widgetPanels) {
      return;
    }
    const { opening, activePanelId } = widgetPanelStatus;
    const actions: AnyAction[] = [];

    if (!opening) {
      actions.push(StoreActions.toggleWidgetPanel(resourceId, resourceType, true));
    }

    const panelHadWidget = widgetPanels!.find((item) => {
      const widgets = item.widgets;
      return widgets.some((widget) => widget.id === widgetId);
    });

    if (panelHadWidget && panelHadWidget.id !== activePanelId) {
      actions.push(StoreActions.switchActivePanel(panelHadWidget.id, resourceId, resourceType));
    }

    if (actions.length) {
      dispatch(batchActions(actions));
    }
  }, [datasheetId, dispatch, widgetId, mirrorId]);

  useEffect(() => {
    function clearExpandModal() {
      const container = document.querySelectorAll(`.${EXPAND_WIDGET}`);
      if (container.length) {
        container.forEach((item) => {
          createRoot(item).unmount();
          item.parentElement!.removeChild(item);
        });
      }
    }

    if (!widgetId) {
      clearExpandModal();
      return;
    }

    openWidgetPanel();

    // expandWidget(widgetId as string);
  }, [widgetId, openWidgetPanel]);
};
