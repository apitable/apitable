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

// {p:[path,idx1], lm:idx2} 将 path 指向的数组中的下标为 idx1 的元素移动到 idx2
export interface IListMoveAction {
  n: OTActionName.ListMove;
  p: IJOTPath;
  lm: number;
}

// {p:[path,key], oi:obj} 在 path 指向的对象的以新的 key 插入新的 obj
export interface IObjectInsertAction {
  n: OTActionName.ObjectInsert;
  p: IJOTPath;
  oi: any;
}

// {p:[path,key], od:obj} 删除 path 指向的对象上的 key 以及内容 obj
export interface IObjectDeleteAction {
  n: OTActionName.ObjectDelete;
  p: IJOTPath;
  od: any;
}

// {p:[path,key], od:before, oi:after} 替换 path 指向的对象上的 key 原有的 before 内容，为 after 内容
export interface IObjectReplaceAction {
  n: OTActionName.ObjectReplace;
  p: IJOTPath;
  od: any;
  oi: any;
}

// {p:[path], t:subtype, o:subtypeOp} 在 path 指向的元素上应用 subtype 类型的 subtypeOp 操作
export interface ISubTypeAction {
  n: OTActionName.SubType;
  p: IJOTPath;
  t: string;
  o: any;
}

// {p:[path,offset], si:s} 在 path 指向的字符串上的 offset 位置上插入字符串 s （内部使用的 subtype 操作）
export interface ITextInsertAction {
  n: OTActionName.TextInsert;
  p: IJOTPath;
  si: string;
}

// {p:[path,offset], sd:s} 在 path 指向的字符串上的 offset 位置上删除字符串 s （内部使用的 subtype 操作）
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
  messageId: string; // 随机字符串，用来给当前 id 做唯一性标记，防止重复消费
  resourceType: ResourceType;
  resourceId: string;
  operations: IOperation[];
}

/**
 * changeset 客户端给服务端发送的一个数据包，它的特点就是带有版本信息。描述了用户一段时间内进行的所有操作。
 * 本地发送到服务端的 changeset 带有 baseRevision, 表示这段 changeset 是基于这个版本的快照生成的。
 */
export interface ILocalChangeset extends IChangeset {
  baseRevision: number;
}

/**
 * 从服务端收到的远程 changeset
 * 远程 changeset 拥有被服务端认证的确定的 revision 版本。
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
