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
import { FieldType, IReduxState, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';

export const getDatasheetOrLoad = (
  state: IReduxState,
  foreignDatasheetId: string,
  dstId?: string,
  assignDstId?: boolean,
  forceFetch?: boolean,
  ignoreMirror?: boolean,
) => {
  const { formId, mirrorId } = state.pageParams;
  const datasheetId = dstId || state.pageParams.datasheetId;
  const datasheet = Selectors.getDatasheet(state, foreignDatasheetId);
  const datasheetLoading = Selectors.getDatasheetLoading(state, foreignDatasheetId);
  const datasheetErrorCode = Selectors.getDatasheetErrorCode(state, foreignDatasheetId);
  const fieldMap = datasheet?.snapshot.meta?.fieldMap;
  // check if foreign datasheet has link relationship
  const isforeignDatasheetIdRelated = fieldMap ? Object.values(fieldMap).some(field =>
    [FieldType.Link, FieldType.OneWayLink].includes(field.type) && field.property.foreignDatasheetId === foreignDatasheetId) : true;

  if (
    isforeignDatasheetIdRelated &&
    (forceFetch || (!datasheet && !datasheetLoading && !datasheetErrorCode) || (datasheet?.isPartOfData && !datasheetLoading && !datasheetErrorCode))
  ) {
    if (formId) {
      store.dispatch(StoreActions.fetchForeignDatasheet(formId, foreignDatasheetId, forceFetch));
      return null;
    }
    if (mirrorId && !ignoreMirror) {
      store.dispatch(StoreActions.fetchForeignDatasheet(mirrorId, foreignDatasheetId, forceFetch));
      return null;
    }
    if (assignDstId && datasheetId) {
      store.dispatch(StoreActions.fetchForeignDatasheet(datasheetId, foreignDatasheetId, forceFetch));
      return null;
    }
  }
  return datasheet;
};
