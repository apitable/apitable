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

import { IBaseDatasheetPack } from 'exports/store';
import { IDataStorageProvider, IStoreProvider } from '../providers';
import { Datasheet, IDatasheetOptions } from './datasheet';

/**
 * A database is responsible for providing `Datasheet` instances.
 *
 * Conceptually, one database corresponds to one space in APITable.
 */
export class Database {
  private storageProvider!: IDataStorageProvider;
  private stores: WeakMap<IBaseDatasheetPack, Datasheet> = new WeakMap();
  private storeProvider!: IStoreProvider;

  /**
   * Set the data storage provider for the database.
   *
   * A data storage provider must be set before loading datasheets.
   */
  setDataStorageProvider(provider: IDataStorageProvider): void {
    this.storageProvider = provider;
  }

  /**
   * Set the store provider that is responsible for providing internal redux stores for datasheets in this database.
   *
   * A store provider must be set before loading datasheets.
   */
  setStoreProvider(provider: IStoreProvider) {
    this.storeProvider = provider;
  }

  /**
   * Load a datasheet in the database.
   */
  async getDatasheet(dstId: string, options: IDatasheetOptions): Promise<Datasheet | null> {
    const datasheetPack = await this.storageProvider.loadDatasheetPack(dstId, options);
    if (datasheetPack === null) {
      return null;
    }
    if (this.stores.has(datasheetPack)) {
      return this.stores.get(datasheetPack)!;
    }
    const store = options.createStore ? await options.createStore(datasheetPack) : await this.storeProvider.createStore(datasheetPack);
    const datasheet = new Datasheet(datasheetPack, store, this.storageProvider);
    this.stores.set(datasheetPack, datasheet);
    return datasheet;
  }
}
