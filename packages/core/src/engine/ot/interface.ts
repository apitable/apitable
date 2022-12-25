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

import { FieldType, ResourceType } from 'types';

// Use words' first letter as the identifier to save network transmission bytes
export enum OTActionName {
  NumberAdd = 'NA',
  ListInsert = 'LI',
  ListDelete = 'LD',
  ListReplace = 'LR',
  ListMove = 'LM',
  ObjectInsert = 'OI',
  ObjectDelete = 'OD',
  ObjectReplace = 'OR',
  SubType = 'ST',
  TextInsert = 'TI',
  TextDelete = 'TD',
}

export type IJOTPath = (string | number)[];

/**
 * {p:[path], na:x} at the `path` value number add `x` ( `x` can be a negative number )
 */
export interface INumberAddAction {
  n: OTActionName.NumberAdd;
  p: IJOTPath;
  na: number;
}

/**
 * {p:[path,idx], li:obj} before the `path` value array's `idx` index, insert object `obj` 
 * 
 */
export interface IListInsertAction {
  n: OTActionName.ListInsert;
  p: IJOTPath;
  li: any;
}

/**
 * {p:[path,idx], ld:obj} Delete `path` of array `idx` index value
 */
export interface IListDeleteAction {
  n: OTActionName.ListDelete;
  p: IJOTPath;
  ld: any;
}

/**
 * {p:[path,idx], ld:before, li:after} use `after` to replace `path`'s `idx` index value `before` 
 */
export interface IListReplaceAction {
  n: OTActionName.ListReplace;
  p: IJOTPath;
  ld: any;
  li: any;
}

// {p:[path,idx1], lm:idx2} Move the element with index idx1 in the array pointed to by path to idx2
export interface IListMoveAction {
  n: OTActionName.ListMove;
  p: IJOTPath;
  lm: number;
}

// {p:[path,key], oi:obj} insert a new obj with a new key at the object pointed to by path
export interface IObjectInsertAction {
  n: OTActionName.ObjectInsert;
  p: IJOTPath;
  oi: any;
}

// {p:[path,key], od:obj} delete the key and content obj on the object pointed to by path
export interface IObjectDeleteAction {
  n: OTActionName.ObjectDelete;
  p: IJOTPath;
  od: any;
}

// {p:[path,key], od:before, oi:after} Replace the original before content of the key on the object pointed to by path to the after content
export interface IObjectReplaceAction {
  n: OTActionName.ObjectReplace;
  p: IJOTPath;
  od: any;
  oi: any;
}

// {p:[path], t:subtype, o:subtypeOp} applies the subtypeOp operation of type subtype on the element pointed to by path
export interface ISubTypeAction {
  n: OTActionName.SubType;
  p: IJOTPath;
  t: string;
  o: any;
}

// {p:[path,offset], si:s} inserts the string s at offset position on the string pointed to by path (subtype operation used internally)
export interface ITextInsertAction {
  n: OTActionName.TextInsert;
  p: IJOTPath;
  si: string;
}

// {p:[path,offset], sd:s} deletes the string s at offset position on the string pointed to by path (subtype operation used internally)
export interface ITextDeleteAction {
  n: OTActionName.TextDelete;
  p: IJOTPath;
  sd: string;
}

export type IJOTAction = INumberAddAction | IListInsertAction | IListDeleteAction |
  IListReplaceAction | IListMoveAction | IObjectInsertAction | IObjectDeleteAction |
  IObjectReplaceAction | ISubTypeAction | ITextInsertAction | ITextDeleteAction;

export type IAnyAction = { [key: string]: any };

/**
 * save the `cmd` name to associate each modification with the user operation, 
 * to facilitate history backtracking and tracking
 */
export interface IOperation {
  cmd: string;
  actions: IJOTAction[];
  mainLinkDstId?: string;
  fieldTypeMap?: {
    [fieldId: string]: FieldType
  };
  resourceType?: ResourceType,
  revision?: number;
}

export interface IChangeset {
  /**
   * random string, 
   */
  messageId: string; // random string used to uniquely mark the current id to prevent repeated consumption
  resourceType: ResourceType;
  resourceId: string;
  operations: IOperation[];
}

/**
  * A packet sent by the changeset client to the server, which is characterized by version information. 
  * Describes all actions performed by the user over a period of time.
  * The changeset sent locally to the server has baseRevision, indicating that this changeset is generated based on the snapshot of this version.
  */
export interface ILocalChangeset extends IChangeset {
  baseRevision: number;
}

/**
 * Remote changeset received from server
 * The remote changeset has a certain revision certified by the server.
 */
export interface IRemoteChangeset extends IChangeset {
  userId?: string;
  revision: number;
  createdAt?: number;
}

export interface IJot {
  apply: (json: any, actions: IJOTAction[]) => void;

  transformX: (leftOp: IJOTAction[], rightOp: IJOTAction[]) => [IJOTAction[], IJOTAction[]];

  transform: (op: IJOTAction[], otherOp: IJOTAction[], type: 'left' | 'right') => IJOTAction[];

  invert: (op: IJOTAction[]) => IJOTAction[];

  compose: (op: IJOTAction[], otherOp: IJOTAction[]) => IJOTAction[];
}
