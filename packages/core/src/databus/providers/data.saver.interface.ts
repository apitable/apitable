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

import { IResourceOpsCollect } from 'command_manager';
import { IReduxState } from 'exports/store/interfaces';
import { Store } from 'redux';
import { IResource } from '../logic';

/**
 * A data saver is responsible for saving the results of command execution into various storage system.
 *
 * For example, in the front end, a data saver implementation sends command execution results to the server;
 * while in the back end, another data saver implementation saves the results into the database.
 */
export interface IDataSaver {
  /**
   * Save the OPs resulted from command execution to some storage system, such as a database or send them to the server.
   *
   * @param ops The OPs resulted from command execution.
   * @param options save options
   * @return The return value of `saveOps` will be included in the return value of the `doCommand` method of `Database`.
   */
  saveOps(ops: IResourceOpsCollect[], options: ISaveOpsOptions): Promise<any> | any;

  nestRoomChangeFromRust(roomId: string, data: any): any;
}

/**
 * The options for saving command execution results. Implementors of `IDataSaver` can derive this interface, adding necessary fields.
 */
export interface ISaveOpsOptions {
  resource: IResource;
  store: Store<IReduxState>;
}
