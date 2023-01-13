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

import { IDataLoader } from './data.loader.interface';
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
export interface IDataStorageProvider extends IDataLoader, IDataSaver {}
