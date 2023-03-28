import { IReduxState, Selectors } from 'core';
import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getWidgetDatasheet } from 'store';

/**
 * Get the bound datasheet view and handle returning only one view in the mirror.
 * @param datasheetId 
 */
export const useViews = (datasheetId?: string) => {
  const views = useSelector(state => {
    const sourceId = state.widget?.snapshot.sourceId;
    const datasheet = getWidgetDatasheet(state, datasheetId);
    if (!datasheet) {
      return [];
    }
    const views = datasheet.snapshot.meta.views;
    if (sourceId?.startsWith('mir')) {
      const sourceInfo = Selectors.getMirrorSourceInfo(state as any as IReduxState, sourceId);
      if (sourceInfo) {
        const viewData = views.find(viewData => viewData.id === sourceInfo.viewId);
        return viewData ? [viewData] : [];
      }
    }
    return views;
  }, shallowEqual);
  return useMemo(() => views, [views]);
};