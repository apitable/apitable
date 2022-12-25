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

/**
 * A data loader is responsible for loading internal datasheet packs for `Datasheet`s from different data sources.
 *
 * For example, in the front end, a data loader implementation fetches datasheet packs from the server; while in the back end,
 * another data loader implementation loads datasheet packs from the database.
 */
export interface IDataLoader {
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
