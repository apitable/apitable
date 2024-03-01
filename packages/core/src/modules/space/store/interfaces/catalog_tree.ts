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

import * as actions from '../../../shared/store/action_constants';
import { Role } from 'config/constant';
import { ConfigConstant } from 'config';
import { ICommitRemind } from '../../../shared/api/api.interface';
import { ITeamData } from '../../../org/store/interface/address_list';

export { Role };

export interface ICatalogTree {
  loading: boolean;
  node: INewNode | null;
  delNodeId: string;
  editNodeId: string;
  copyNodeId: string;
  isCopyAll: boolean;
  err: string;
  optNode: IOptNode | null;
  rootId: string;
  treeNodesMap: ITreeNodesMap;
  expandedKeys: string[];
  loadedKeys: string[];
  unit: IUnit | null;
  allVisible: boolean;
  isPermission: boolean;
  socketData: INodeChangeSocketData | null;
  activeType?: ConfigConstant.Modules;
  // private
  privateRootId: string;
  privateLoading: boolean;
  privateEditNodeId: string;
  privateDelNodeId: string;
  privateTreeNodesMap: ITreeNodesMap;
  privateExpandedKeys:string[];
  // favorite
  favoriteEditNodeId: string;
  favoriteDelNodeId: string;
  favoriteTreeNodeIds: string[];
  favoriteLoading: boolean;
  favoriteExpandedKeys: string[];
  activeNodeError: boolean;
  permissionModalNodeId: string;
  shareModalNodeId: string;
  saveAsTemplateModalNodeId: string;
  importModalNodeId: string;
  /**
   * whether the permission setting UI window comes from the notification call
   */
  permissionCommitRemindStatus: boolean;
  /**
   * the arguments that member send messages
   */
  permissionCommitRemindParameter: ICommitRemind | null;
  /**
   * unit ids that members have no permissions
   */
  noPermissionMembers: string[];
  /**
   * move to (move file) UI window
   */
  moveToNodeIds?: string[];
}

export interface IRightClickInfo {
  /**
   * the data ID carried by the right-click node (such as node ID, View ID)
   */
  id: string;
  /**
   * indicates which module it comes from (such as the working directory, the starred directory)
   */
  module: ConfigConstant.Modules;
  /**
   * indicates which type of menu to call
   */
  contextMenuType: ConfigConstant.ContextMenuType;
  // current node's level
  level: string;
}

export interface INode {
  spaceId: string;
  nodeId: string;
  parentId: string;
  nodeName: string;
  type: number;
  icon: string;
  hasChildren: boolean;
  columnLimit: boolean;
  creator: boolean;
  role: Role;
  permissions: IPermissions;
  preNodeId: string;
  children?: INode[];
  nodeShared: boolean;
  nodePermitSet: boolean;
  nodeFavorite: boolean;
  preFavoriteNodeId?: string;
  extra?: any;
  nodePrivate: boolean;
}

export interface INodePermissions {
  allowEditConfigurable: boolean;
  allowSaveConfigurable: boolean;
  childCreatable: boolean;
  copyable: boolean;
  descriptionEditable: boolean;
  editable: boolean;
  exportable: boolean;
  iconEditable: boolean;
  importable: boolean;
  manageable: boolean;
  movable: boolean;
  nodeAssignable: boolean;
  readable: boolean;
  removable: boolean;
  renamable: boolean;
  sharable: boolean;
  templateCreatable: boolean;
}

export interface IDatasheetPermission {
  // manageable: boolean;
  // editable: boolean;
  // readable: boolean;
  viewCreatable: boolean;
  viewRenamable: boolean;
  viewRemovable: boolean;
  viewMovable: boolean;
  viewExportable: boolean;
  viewFilterable: boolean;
  columnSortable: boolean;
  columnHideable: boolean;
  fieldSortable: boolean;
  fieldGroupable: boolean;
  rowHighEditable: boolean;
  columnWidthEditable: boolean;
  columnCountEditable: boolean;
  rowSortable: boolean;
  fieldCreatable: boolean;
  fieldRenamable: boolean;
  fieldPropertyEditable: boolean;
  fieldRemovable: boolean;
  rowCreatable: boolean;
  rowRemovable: boolean;
  rowArchivable: boolean;
  rowUnarchivable: boolean;
  cellEditable: boolean;
  descriptionEditable: boolean;
  fieldPermissionManageable: boolean;
  viewLayoutEditable: boolean;
  viewStyleEditable: boolean;
  viewKeyFieldEditable: boolean;
  viewColorOptionEditable: boolean;
  viewManualSaveManageable: boolean;
  viewOptionSaveEditable: boolean;
  visualizationEditable?: boolean;
}

export type IPermissions = INodePermissions & IDatasheetPermission;

export interface IShareSettings {
  nodeId: string;
  nodeName: string;
  shareOpened: boolean;
  nodeIcon: string;
  props: {
    onlyRead: boolean;
    canBeEdited: boolean;
    canBeStored: boolean;
  };
  shareId: string;
  linkNodes: string[];
  containMemberFld: boolean;
  shareOpenOperator: string;
  operatorHasPermission: boolean;
}

export enum NodeErrorType {
  ChildNodes = 'ChildNodes',
}

export interface INodesMapItem extends Omit<INode, 'children'> {
  children: string[];
  errType: NodeErrorType | null;
}

export interface ITreeNodesMap {
  [nodeId: string]: INodesMapItem;
}

export interface ITreeNode {
  nodeId: string;
  children: ITreeNode[];
}

export interface IParent {
  nodeId: string;
  nodeName: string;
}

export interface IUpdateRoleData {
  roles: {
    unitId: string;
    role: string;
  }[];
  nodeId: string;
  extend: boolean;
}

export interface IShowCaseData {
  cover: string;
  description: string;
  icon: string;
  nodeId: string;
  nodeName: string;
  permissions: INodePermissions;
  role: string;
  type: number;
}

export interface INodeChangeSocketData {
  socketId: string;
  type: string;
  spaceId: string;
  data: any;
  receiptTime: number;
}

export interface IUpdateSocketDataAction {
  type: typeof actions.UPDATE_SOCKET_DATA;
  payload: INodeChangeSocketData;
}

export interface ISetRootIdAction {
  type: typeof actions.SET_ROOT_ID;
  payload: {
    rootId: string;
  };
}

export interface ISetNodeNameAction {
  type: typeof actions.SET_NODE_NAME;
  payload: {
    nodeId: string;
    nodeName: string;
    module?: ConfigConstant.Modules;
  };
}

export interface ISetNodeErrorTypeAction {
  type: typeof actions.SET_NODE_ERROR_TYPE;
  payload: {
    nodeId: string;
    errType: NodeErrorType;
    module?: ConfigConstant.Modules;
  };
}

export interface IOptNode {
  nodeId: string;
  parentId: string;
  module?: ConfigConstant.Modules
}

export interface INewNode extends INode {
  index: number;
}

export interface INodePermissionData {
  nodeId: string;
  name: string;
  icon: string;
  type: number;
}

/**
 * Unit, (parent of team and member)
 */
export interface IUnit {
  teams: ITeam[];
  tags: ITag[];
  members: IMember[];
}

export interface ITeam {
  unitId: string;
  teamId: string;
  teamName: string;
  originName: string;
  memberCount: number;
  hasChildren: boolean;
  hasChildrenTeam: boolean;
}

export interface ITag {
  unitId: string;
  tagId: string;
  tagName: string;
  originName: string;
  memberCount: number;
}

export interface IMember {
  unitId: string;
  uuid: string;
  memberId: string;
  memberName: string;
  originName: string;
  email: string;
  mobile: string;
  avatar: string;
  avatarColor: number | null;
  nickName: string;
  isActive: boolean;
  isDeleted: boolean;
  teams: string;
  teamData: ITeamData[];
  // for weCom(wechat work)
  isMemberNameModified?: boolean;
  isNickNameModified?: boolean;
}

export interface IRoleUnit {
  unitId: string;
  unitName: string;
  unitType: number;
  memberCount: number;
  avatar: string;
  avatarColor: number | null;
  nickName: string;
  teams: string;
  role: string;
  unitRefId?: string;
  teamData: ITeamData[];
}

export interface IRoleMember {
  memberId: string;
  memberName: string;
  nickName: string;
  avatar: string;
  avatarColor: number | null;
  teams: string;
  role: string;
}

export interface INodeRoleMap {
  extend: boolean;
  admins: IMember[];
  extendNodeName: string;
  owner: IMember | null;
  self: IMember | null;
  roleUnits: IRoleUnit[];
  members: IRoleMember[];
  roles: INodeRoleMapItem[];
}

export interface INodeRoleMapItem {
  role: string;
  teams: ITeam[];
  tags: ITag[];
  members: IMember[];
}

export interface IBreadCrumbData {
  name: string;
  teamId: string;
}

export type UnitType = 'teams' | 'tags' | 'members';
export type UnitItem =
  | ITeam
  | ITag
  | IMember
  | {
      unitId: string;
      roleId: string;
      roleName: string;
      memberCount: number;
      position: number;
    };

export interface IRefreshTreeAction {
  type: typeof actions.REFRESH_TREE;
  payload: INode[];
}

export interface ISetAllVisibleAction {
  type: typeof actions.SET_ALL_VISIBLE;
  payload: boolean;
}

export interface ISetActiveTreeType {
  type: typeof actions.SET_ACTIVE_TREE_TYPE;
  payload: ConfigConstant.Modules;
}

// Action
export interface ISetDelNodeIdAction {
  type: typeof actions.SET_DEL_NODE_ID;
  payload: {
    nodeId: string;
    module: ConfigConstant.Modules;
  };
}

export interface IDeleteNodeAction {
  type: typeof actions.DELETE_NODE;
  payload: {
    parentId: string;
    nodeId: string;
  };
}

export interface IMoveNodeToFolderAction {
  type: typeof actions.MOVE_NODE_TO_FOLDER;
  payload: {
    dragNode: ITreeNode;
    dropNode: ITreeNode;
  };
}

export interface ICoLayerMoveNodeAction {
  type: typeof actions.CO_LAYER_MOVE_NODE;
  payload: {
    dragNode: ITreeNode;
    dropNode: ITreeNode;
    dropPosition: number;
  };
}

export interface ISetOptNodeAction {
  type: typeof actions.SET_OPT_NODE;
  payload: IOptNode | null;
}

export interface ISetErrAction {
  type: typeof actions.SET_ERR;
  payload: string;
}

export interface ISetEditNodeIdAction {
  type: typeof actions.SET_EDIT_NODE_ID;
  payload: {
    nodeId: string;
    module: ConfigConstant.Modules;
  };
}

export interface IAddNodeToMapAction {
  type: typeof actions.ADD_NODE_TO_MAP;
  payload: {
    data: (Omit<INodesMapItem, 'children'> & { children?: string[] })[];
    /**
     * Whether to keep the old children or use the new children to replace the old children
     */
    isCoverChildren: boolean;
    module: ConfigConstant.Modules;
  };
}

export interface ISetIsCopyAllAction {
  type: typeof actions.SET_IS_COPY_ALL;
  payload: boolean;
}

export interface ISetExpandedKeysActions {
  type: typeof actions.SET_EXPANDED_KEYS;
  payload: {
    expandedKeys: string[];
    module: ConfigConstant.Modules;
  };
}

export interface IInitCatalogTreeAction {
  type: typeof actions.INIT_CATALOG_TREE;
}

export interface ISetCopyNodeIdAction {
  type: typeof actions.SET_COPY_NODE_ID;
  payload: string;
}

export interface ISetLoadedAction {
  type: typeof actions.TREE_LOADING;
  payload: {
    loading: boolean;
    module: ConfigConstant.Modules;
  };
}

export interface IUpdateHasChildren {
  type: typeof actions.UPDATE_HAS_CHILDREN;
  payload: {
    nodeId: string;
    module?: ConfigConstant.Modules;
  };
}

export interface IMoveToAction {
  type: typeof actions.NODE_MOVE_TO;
  payload: {
    nodeId: string;
    targetNodeId: string;
    pos: number;
    module?: ConfigConstant.Modules;
  };
}

export interface IUpdateTreeNodesMapAction {
  type: typeof actions.UPDATE_TREE_NODES_MAP;
  payload: {
    nodeId: string;
    data: Partial<INodesMapItem>;
    module?: ConfigConstant.Modules;
  };
}

export interface IClearNodeAction {
  type: typeof actions.CLEAR_NODE;
}

export interface IRemoveNodeFromMapAction {
  type: typeof actions.REMOVE_NODE_FROM_MAP;
  payload: string | string[];
}

export interface IUpdateIsPermissionAction {
  type: typeof actions.UPDATE_IS_PERMISSION;
  payload: boolean;
}

export interface IUpdateRoleData {
  roles: {
    unitId: string;
    role: string;
  }[];
  nodeId: string;
  extend: boolean;
}

export interface IAddNodeToFavoriteTreeAction {
  type: typeof actions.ADD_NODE_TO_FAVORITE_LIST;
  payload: {
    nodeIds: string[];
    parentId: string;
  };
}

export interface IRemoveFavoriteNodeAction {
  type: typeof actions.REMOVE_FAVORITE_NODE;
  payload: string;
}

export interface IDeleteNodeFromFavoriteTreeAction {
  type: typeof actions.DELETE_NODE_FROM_FAVORITE_LIST;
  payload: IOptNode;
}

export interface IMoveFavoriteNodeAction {
  type: typeof actions.MOVE_FAVORITE_NODE;
  payload: {
    nodeId: string;
    preNodeId: string;
  };
}

export interface IInitFavoriteTreeNodesAction {
  type: typeof actions.INIT_FAVORITE_TREE_NODES;
}

export interface ISetActiveNodeErrorAction {
  type: typeof actions.SET_ACTIVE_NODE_ERROR;
  payload: boolean;
}

export interface IUpdatePermissionModalNodeIdAction {
  type: typeof actions.UPDATE_PERMISSION_MODAL_NODE_ID;
  payload: string;
}

export interface IUpdateShareModalNodeIdAction {
  type: typeof actions.UPDATE_SHARE_MODAL_NODE_ID;
  payload: string;
}

export interface IUpdateSaveAsTemplateModalNodeIdAction {
  type: typeof actions.UPDATE_SAVE_AS_TEMPLATE_MODAL_NODE_ID;
  payload: string;
}

export interface IUpdateImportModalNodeIdAction {
  type: typeof actions.UPDATE_IMPORT_MODAL_NODE_ID;
  payload: string;
}

export interface ISetTreeRootIdAction {
  type: typeof actions.SET_TREE_ROOT_ID;
  payload: string;
}

export interface ISetPrivateTreeRootIdAction {
  type: typeof actions.SET_PRIVATE_TREE_ROOT_ID;
  payload: string;
}

export interface ISetLoadedKeysAction {
  type: typeof actions.SET_LOADED_KEYS;
  payload: string[];
}

export interface ISetPermissionModalMessageStatusAction {
  type: typeof actions.SET_PERMISSION_COMMIT_REMIND_STATUS;
  payload: boolean;
}

export interface ISetPermissionCommitRemindParameterAction {
  type: typeof actions.SET_PERMISSION_COMMIT_REMIND_PARAMETER;
  payload: ICommitRemind;
}

export interface ISetNoPermissionMembersAction {
  type: typeof actions.SET_NO_PERMISSION_MEMBERS;
  payload: string[];
}

export interface IUpdateMoveToNodeIdsAction {
  type: typeof actions.UPDATE_MOVE_TO_NODE_IDS;
  payload: string[];
}
