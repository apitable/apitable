import { ResourceType, Selectors, StoreActions, IWidgetPanelStatus } from '@apitable/core';
import { usePrevious } from 'ahooks';
import { difference } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { store } from 'pc/store';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export const useManageWidgetMap = () => {
  const dispatch = useAppDispatch();
  const { datasheetId, mirrorId } = useSelector(state => state.pageParams);
  const resourceId = mirrorId || datasheetId;
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
  const activeWidgetPanel = useSelector(state => Selectors.getResourceActiveWidgetPanel(state, resourceId!, resourceType));

  const activeWidgetInPanelIds = useMemo(() => {
    if (!activeWidgetPanel) {
      return [];
    }
    // Here the array needs to be sorted to avoid the effects of drag-and-drop sorting.
    return activeWidgetPanel.widgets.map(item => {
      return item.id;
    }).sort();
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
  const spaceId = useSelector(state => state.space.activeId);
  const { datasheetId, mirrorId } = useSelector(state => ({
    datasheetId: state.pageParams.datasheetId,
    mirrorId: state.pageParams.mirrorId,
  }), shallowEqual);

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
      const { width, opening, activePanelId } = Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || {} as IWidgetPanelStatus;
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
