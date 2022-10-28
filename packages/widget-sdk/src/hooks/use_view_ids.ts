import { shallowEqual, useSelector } from 'react-redux';
import { IWidgetState } from 'interface';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';

const viewSelector = (state: IWidgetState, datasheetId?: string) => {
  const datasheet = getWidgetDatasheet(state, datasheetId);
  if (!datasheet) {
    return [];
  }
  return datasheet.snapshot.meta.views.map(view => view.id);
};

/**
 * Gets the ID of all view of the currently datasheet.
 * Rerendering is triggered when the number of views changes.
 * 
 * @returns
 * 
 * ### Example
 * ```js
 * import { useViewIds, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // Display the total number of views 
 * function ViewCount() {
 *   const viewIds = useViewIds();
 *   return <p>There are currently {viewIds.length} views</p>;
 * }
 * // Displays the total number of views corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function DatasheetViewCount() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewIds = useViewIds(datasheet);
 *   return <p>There are currently {viewIds.length} views</p>;
 * }
 * ```
 * 
 */
export function useViewIds(datasheet?: Datasheet) {
  return useSelector(state => viewSelector(state, datasheet?.datasheetId), shallowEqual);
}
