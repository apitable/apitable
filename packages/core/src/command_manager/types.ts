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

import { IOperation } from 'engine';
import { IFieldMap, IReduxState } from '../exports/store/interfaces';
import { ILinkedActions } from './command';
import { LinkedDataConformanceMaintainer } from 'model/linked_data_conformance_maintainer';
import { MemberFieldMaintainer } from 'model/member_maintainer';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { IResourceOpsCollect } from './command_manager';

export interface ICollaCommandExecuteContext {
  state: IReduxState;
  ldcMaintainer: LinkedDataConformanceMaintainer;
  memberFieldMaintainer: MemberFieldMaintainer;
  fieldMapSnapshot: IFieldMap;
}

export enum ExecuteType {
  Execute,
  Undo,
  Redo,
}

export enum ExecuteResult {
  /** No need to execute */
  None = 'None',
  Fail = 'Fail',
  Success = 'Success',
}

export enum ExecuteFailReason {
  /** Don't know what went wrong */
  Unknown = 'Unknown',

  /** action validation failed */
  ActionError = 'ActionError',

  /** Operate on unsupported field, view */
  NotSupport = 'NotSupport',

  /** table, view name duplicate */
  NameRepeat = 'NameRepeat',

  /** The last one, cannot be deleted */
  LastOne = 'LastOne',

  /** Field type mismatch */
  FieldTypeNotMatch = 'FieldTypeNotMatch',

  /** Passed parameter problem */
  WrongOptions = 'WrongOptions',
}

export interface ICollaCommandExecuteResultBase {
  resourceId: string;
  resourceType: ResourceType;
}

export interface ICollaCommandOptionsBase extends ICollaCommandExecuteResultBase {
  cmd: CollaCommandName;
}

export interface ICollaCommandExecuteSuccessResult<T = any> extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Success;
  data?: T;
  operation: IOperation;
  linkedActions?: ILinkedActions[];
  executeType: ExecuteType;
  fieldMapSnapshot?: IFieldMap;
  resourceOpsCollects: IResourceOpsCollect[];
}

export interface ICollaCommandExecuteFailResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Fail;
  reason: ExecuteFailReason;
}

export interface ICollaCommandExecuteNoneResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.None;
}

export type ICollaCommandExecuteResult<T = any> =
  | ICollaCommandExecuteSuccessResult<T>
  | ICollaCommandExecuteFailResult
  | ICollaCommandExecuteNoneResult;
