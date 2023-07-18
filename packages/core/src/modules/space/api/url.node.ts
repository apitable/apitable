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

// =============== Node related =======================
// get the root node
export const GET_ROOT_NODE = '/node/root';
// Query the list of child nodes
export const GET_NODE_LIST = '/node/children';
// Get whether you can manage the visible state of all members
export const ALLOW_VISIBLE_SETTING = '/node/allowManageWorkbenchSetting';
// Query the chain from parent node to root node
export const GET_PARENTS = '/node/parents';
// Query the node tree of the workbench, limit the query to two layers
export const GET_NODE_TREE = '/node/tree';
// Query node information
export const GET_NODE_INFO = '/node/get';
// Query the child node to which it belongs based on the parent node id
export const SELECTBYPARENTID = '/node/selectByParentId/';
// move node
export const MOVE_NODE = '/node/move';
// add node
export const ADD_NODE = '/node/create';
// delete node

export const ADD_CHAT_BOT = '/ai/chatbot';

export const DELETE_NODE = '/node/delete/';
// edit node
export const EDIT_NODE = '/node/update/';
// copy node
export const COPY_NODE = '/node/copy';
// Get the table ID
export const GET_DST_ID = '/node/getDstId/';
// record active table tab
export const KEEP_TAB_BAR = '/node/active';
// directory tree location
export const POSITION_NODE = '/node/position/';
// retrieve node

// TODO: to be discarded
export const FIND_NODE = '/node/select';
// search node
export const SEARCH_NODE = '/node/search';
// import datasheet
export const IMPORT_FILE = '/node/import';
// Get the number of folders and files
export const NODE_NUMBER = '/node/count';
// modify the character
export const UPDATE_ROLE = '/node/updateRole';
// close node sharing
export const DISABLE_SHARE = '/node/disableShare/';
// Refresh the node share link
export const REGENERATE_SHARE_LINK = '/node/regenerateShareLink/';
// Get node sharing settings
export const SHARE_SETTINGS = '/node/shareSettings/';
// update node description
export const CHANGE_NODE_DESC = '/node/updateDesc';
// Get the information of the shared node
export const READ_SHARE_INFO = '/node/readShareInfo';
// dump node
export const STORE_SHARE_DATA = '/node/storeShareData';
// Change node sharing settings
export const UPDATE_SHARE = '/node/updateShare/';
export const NODE_SHOWCASE = '/node/showcase';
// Member field mentions other records
export const COMMIT_REMIND = '/node/remind';
// Enable node inheritance mode
export const ENABLE_ROLE_EXTEND = '/node/enableRoleExtend';
// Turn off node inheritance mode
export const DISABLE_ROLE_EXTEND = '/node/disableRoleExtend';
// delete node role
export const DELETE_ROLE = '/node/deleteRole';
// Query the list of node roles
export const NODE_LIST_ROLE = '/node/listRole';
// Modify the role of the node's organizational unit
export const EDIT_ROLE = '/node/editRole';
// Batch modify node permissions
export const BATCH_EDIT_ROLE = '/node/batchEditRole';
// delete node permissions
export const BATCH_DELETE_ROLE = 'node/batchDeleteRole';
// Add the organizational unit of the specified role of the node
export const ADD_ROLE = '/node/addRole';
// Query the node list of the recycle bin
export const TRASH_LIST = '/node/rubbish/list';
// restore node
export const TRASH_RECOVER = '/node/rubbish/recover';
// delete the node from the recycle bin
export const TRASH_DELETE = '/node/rubbish/delete/';
// Change the node collection state
export const UPDATE_NODE_FAVORITE_STATUS = '/node/favorite/updateStatus/';
// Move the collection node position
export const MOVE_FAVORITE_NODE = '/node/favorite/move';
// Query the list of favorite nodes
export const FAVORITE_NODE_LIST = '/node/favorite/list';
// Query the magic form/mirror associated with the data table node
export const DATASHEET_FOREIGN_FORM = '/node/getRelNode';
// Get the node of the specified type in the directory tree
export const GET_SPECIFY_NODE_LIST = '/node/list';
// =============== Node related =======================

// recently browsed folder
export const NODE_RECENTLY_BROWSED = '/node/recentList';

// Get node information - file information window
export const GET_NODE_INFO_WINDOW = 'node/window';

export const CHECKOUT_ORDER = '/checkout';
