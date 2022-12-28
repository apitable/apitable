
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

import { Datasheet } from 'databus/logic';
import { IBaseDatasheetPack, IReduxState } from 'exports/store';
import { Store } from 'redux';
import { IDataSaver } from './data.saver.interface';

/**
 * A data storage provider is responsible for loading internal datasheet packs for `Datasheet`s from different data sources, as well as 
 * saving the results of executing commands into various data storage system.
 *
 * For example, in the front end, a data storage provider implementation fetches datasheet packs from the server, and sends command results
 * to the server; while in the back end, another data storage provider implementation loads datasheet packs from the 
 * For example, in the front end, a data loader implementation fetches datasheet packs from the server; while in the back end,
 * another data loader implementation loads datasheet packs from the database, and saves the command execution result into the database.
 */
export interface IDataStorageProvider extends IDataSaver {
  /**
   * Loads a datasheet pack for a datasheet from the data source. Returns null if the datasheet is not found.
   *
   * The implemention may customize fields in `options`.
   */
  loadDatasheetPack(dstId: string, options: ILoadDatasheetPackOptions): Promise<IBaseDatasheetPack | null> | IBaseDatasheetPack | null;
}

/**
 * The options of loading datasheet packs. Implementors of `IDataLoader` can derive this interface, adding necessary fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadDatasheetPackOptions {}

/**
 * The options of saving command execution results. Implementors of `IDataSaver` can derive this interface, adding necessary fields.
 */
export interface ISaveOpsOptions {
  datasheet: Datasheet;
  store: Store<IReduxState>;
}
