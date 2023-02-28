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

import { Database } from './logic';
import { IDataStorageProvider, IStoreProvider } from './providers';

/**
 * The entry point of the DataBus layer.
 */
export class DataBus {
  private _database: Database;

  private constructor() {
    this._database = new Database();
  }

  /**
   * Create a DataBus instance.
   */
  public static create(options: IDataBusInitOptions): DataBus {
    const { dataStorageProvider, storeProvider } = options;
    const databus = new DataBus();

    const db = databus.getDatabase();
    db.setDataStorageProvider(dataStorageProvider);
    db.setStoreProvider(storeProvider);

    return databus;
  }

  /**
   * Get the database of a DataBus instance.
   *
   * Currently, only one database exists for a DataBus instance. In the future, there may be multiple databases
   * for a DataBus instance. And the use cases are:
   *
   * - For front end, there is only one user, so one database suffice.
   * - For back end, the server creates many databases, one database corresponds to one user respectively.
   */
  public getDatabase(): Database {
    return this._database;
  }
}

/**
 * The options to intiailize a DataBus instance.
 */
export interface IDataBusInitOptions {
  dataStorageProvider: IDataStorageProvider;
  storeProvider: IStoreProvider;
}
