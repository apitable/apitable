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

import { IBaseDatasheetPack, IReduxState } from 'exports/store';
import { Store } from 'redux';

/**
 * A store provider is responsible for creating internal redux stores of `Datasheet`s.
 */
export interface IStoreProvider {
  /**
   * Creates a redux store from the datasheet pack.
   */
  createStore(datasheetPack: IBaseDatasheetPack): Promise<Store<IReduxState>> | Store<IReduxState>;
}
