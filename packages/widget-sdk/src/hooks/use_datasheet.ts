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

import { useContext, useMemo } from 'react';
import { IWidgetContext } from 'interface';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from '../model';
import { Selectors, StoreActions } from 'core';
import { getWidgetDatasheetPack, refreshUsedDatasheetAction } from 'store';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { isIframe } from 'iframe_message/utils';
import { widgetMessage } from 'iframe_message';

/**
 * A hook for connecting a React component to your datasheet's schema.
 * Datasheet will provide the interface to make update to datasheet date, and check permission.
 * 
 * @param
 * 
 * @returns Datasheet instance
 * ### Example
 * ```js
 * import { useDatasheet } from '@apitable/widget-sdk';
 *
 * function AddRecord() {
 *   const datasheet = useDatasheet();
 *   const [error, setError] = useState();
 *   // The key of the parameter is the fieldId and the value is the cell value
 *   const valuesMap = {
 *     fld1234567980: 'this is a text value',
 *     fld0987654321: 1024,
 *   }
 *   function addRecord(valuesMap) {
 *     if (!datasheet) {
 *       return;
 *     }
 *     const permission = datasheet.checkPermissionsForAddRecord(valuesMap)
 *     if (permission.acceptable) {
 *       datasheet.addRecord(valuesMap);
 *       return;
 *     }
 *     setError(permission.message);
 *   }
 *   return (<div>
 *     {error && <p>{error}</p>}
 *     <button onClick={() => addRecord(valuesMap)}>add a new record</button>
 *   </div>);
 * }
 * 
 * ```
 * 
 */
export function useDatasheet(datasheetId?: string | undefined) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const { datasheetId: metaDatasheetId } = useMeta();
  const _datasheetId = datasheetId || metaDatasheetId;
  const dispatch = useDispatch();
  const datasheet = useSelector(state => getWidgetDatasheetPack(state, _datasheetId));
  const usedDatasheetMap = useSelector(state => state.datasheetMap, shallowEqual);
  const datasheetObj = Selectors.getDatasheetPack(context.globalStore.getState(), datasheetId);
  const iframe = isIframe();
  if (iframe && datasheetId && (!datasheetObj || datasheetObj.datasheet?.isPartOfData)) {
    widgetMessage.loadOtherDatasheetInit(datasheetId);
  } else if (!iframe && datasheetId && (!datasheetObj || (!datasheetObj.loading && !datasheetObj.errorCode))) {
    !usedDatasheetMap?.[datasheetId] && dispatch(refreshUsedDatasheetAction({ [datasheetId]: null }));
    context.globalStore.dispatch(StoreActions.fetchDatasheet(datasheetId) as any);
  }
  
  return useMemo(() => {
    if (!_datasheetId) return undefined;
    return new Datasheet(_datasheetId, context);
  // eslint-disable-next-line
  }, [_datasheetId, context, datasheet]);
}
