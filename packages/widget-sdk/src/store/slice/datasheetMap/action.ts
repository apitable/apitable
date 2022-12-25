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

import { IDatasheetClient, IDatasheetMap, IDatasheetMainSimple } from 'interface';
import { REFRESH_USED_DATASHEET, REFRESH_USED_DATASHEET_CLIENT, REFRESH_USED_DATASHEET_SIMPLE } from '../../constant';

export interface IStoreRefreshDatasheetMapAction {
  type: typeof REFRESH_USED_DATASHEET;
  payload: IDatasheetMap;
}

export const refreshUsedDatasheetAction = (payload: IDatasheetMap): IStoreRefreshDatasheetMapAction => ({
  type: REFRESH_USED_DATASHEET,
  payload
});

export interface IStoreRefreshDatasheetClientAction {
  type: typeof REFRESH_USED_DATASHEET_CLIENT;
  payload: { datasheetId: string, client: IDatasheetClient };
}

export const refreshUsedDatasheetClientAction = (payload: { datasheetId: string, client: IDatasheetClient }): IStoreRefreshDatasheetClientAction => ({
  type: REFRESH_USED_DATASHEET_CLIENT,
  payload
});

export interface IStoreRefreshDatasheetSimpleAction {
  type: typeof REFRESH_USED_DATASHEET_SIMPLE;
  payload: IDatasheetMainSimple;
}

// As an update action for data other than snapshot.
export const refreshUsedDatasheetSimpleAction = (
  payload: IDatasheetMainSimple
): IStoreRefreshDatasheetSimpleAction => ({
  type: REFRESH_USED_DATASHEET_SIMPLE,
  payload
});

