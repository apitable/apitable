import { ResourceType, Selectors, StoreActions, IWidgetPanelStatus } from '@vikadata/core';
import { store } from 'pc/store';
import { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { EXPAND_WIDGET } from '../components/widget/expand_widget';

export const useExpandWidget = () => {
  const { widgetId, datasheetId, mirrorId } = useSelector(state => state.pageParams);
  const dispatch = useDispatch();

  const openWidgetPanel = useCallback(() => {
    if (!datasheetId) {
      return;
    }
    const state = store.getState();
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    const widgetPanelStatus = Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || {} as IWidgetPanelStatus;
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

    const panelHadWidget = widgetPanels!.find(item => {
      const widgets = item.widgets;
      return widgets.some(widget => widget.id === widgetId);
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
        container.forEach(item => {
          ReactDOM.unmountComponentAtNode(item);
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
