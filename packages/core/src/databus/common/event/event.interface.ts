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
import { IError } from 'types';
import { CommandExecutionResultType } from './command.execution.result.type.enum';
import { ResourceEventType } from './event.type.enum';

export type IResourceEvent = IResourceDataChangeEvent | IResourceCommandExecutedEvent;

export type IResourceDataChangeEvent = INewRecordsEvent;

export interface INewRecordsEvent {
  type: ResourceEventType.DataChange;
}

export type IResourceCommandExecutedEvent = IResourceCommandExecutedSuccessEvent | IResourceCommandExecutedFailEvent;

export interface IResourceCommandExecutedSuccessEvent {
  type: ResourceEventType.CommandExecuted;

  /**
   * The result of the command execution.
   */
  execResult: CommandExecutionResultType.Success;

  /**
   * Resource OPs collected by the `CollaCommandManager`.
   */
  resourceOpCollections: IResourceOpsCollect[];
}

export interface IResourceCommandExecutedFailEvent {
  type: ResourceEventType.CommandExecuted;

  /**
   * The result of the command execution.
   */
  execResult: CommandExecutionResultType.Error;

  /**
   * The error of the command execution.
   */
  error: IError;

  /**
   * The error type of the command execution.
   */
  errorType?: 'message' | 'modal' | 'subscribeUsage';
}
