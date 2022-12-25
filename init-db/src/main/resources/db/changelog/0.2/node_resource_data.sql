-- APITable <https://github.com/apitable/apitable>
-- Copyright (C) 2022 APITable Ltd. <https://apitable.com>
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <http://www.gnu.org/licenses/>.

-- Init Node Role Data
INSERT INTO `${table.prefix}node_role`(id,role_code, role_name, role_level, role_desc) VALUES (1233225128846229505, 'administrator', 'Administrator', 0, 'Roles with the highest permissions in the workspace');
INSERT INTO `${table.prefix}node_role`(id,role_code, role_name, role_level, role_desc) VALUES (1233225129022390273, 'none', 'No Access', 1, 'Prohibit access to nodes');
INSERT INTO `${table.prefix}node_role`(id,role_code, role_name, role_level, role_desc) VALUES (1233225129026584577, 'manager', 'Manageable', 2, 'Manage operations related to working directory');
INSERT INTO `${table.prefix}node_role`(id,role_code, role_name, role_level, role_desc) VALUES (1233225129026584578, 'editor', 'Editable', 3, 'Edit work directory name and mobile node');
INSERT INTO `${table.prefix}node_role`(id,role_code, role_name, role_level, role_desc) VALUES (1233225129026584579, 'readonly', 'Viewable', 4, 'Only the work directory can be viewed');
-- Init Node Role Resource Data
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131597692930, 'administrator', 'CREATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131601887234, 'manager', 'CREATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131610275841, 'editor', 'CREATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131627053058, 'administrator', 'UPDATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131631247361, 'manager', 'UPDATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131639635969, 'editor', 'UPDATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131639635970, 'administrator', 'RENAME_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131643830274, 'manager', 'RENAME_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131648024578, 'administrator', 'DELETE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131648024579, 'manager', 'DELETE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131648024580, 'administrator', 'MOVE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131652218881, 'manager', 'MOVE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131652218882, 'administrator', 'READ_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131660607490, 'manager', 'READ_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131660607491, 'editor', 'READ_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131660607492, 'readonly', 'READ_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131660607493, 'administrator', 'IMPORT_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131664801794, 'manager', 'IMPORT_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131664801795, 'editor', 'IMPORT_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131668996097, 'administrator', 'EXPORT_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131668996098, 'manager', 'EXPORT_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131668996099, 'administrator', 'DUPLICATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131673190401, 'manager', 'DUPLICATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131673190402, 'editor', 'DUPLICATE_NODE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131673190403, 'administrator', 'ASSIGN_NODE_ROLE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131677384706, 'manager', 'ASSIGN_NODE_ROLE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131677384707, 'editor', 'ASSIGN_NODE_ROLE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131677384708, 'readonly', 'ASSIGN_NODE_ROLE');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131677384709, 'administrator', 'READ_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773313, 'manager', 'READ_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773314, 'editor', 'READ_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773315, 'readonly', 'READ_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773316, 'administrator', 'RENAME_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773317, 'manager', 'RENAME_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131685773318, 'editor', 'RENAME_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131689967617, 'administrator', 'DELETE_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131689967618, 'manager', 'DELETE_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131689967619, 'editor', 'DELETE_VIEW');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131698356226, 'administrator', 'UPDATE_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131698356227, 'manager', 'UPDATE_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131698356228, 'editor', 'UPDATE_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131698356229, 'administrator', 'LOCK_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131698356230, 'manager', 'LOCK_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131702550529, 'editor', 'LOCK_VIEW_CONFIG');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131702550530, 'administrator', 'CREATE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131702550531, 'manager', 'CREATE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131702550532, 'administrator', 'UPDATE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131702550533, 'manager', 'UPDATE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131710939137, 'administrator', 'DELETE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131710939138, 'manager', 'DELETE_FIELD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131710939139, 'administrator', 'CREATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133442, 'manager', 'CREATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133443, 'editor', 'CREATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133444, 'administrator', 'READ_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133445, 'manager', 'READ_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133446, 'editor', 'READ_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131715133447, 'readonly', 'READ_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131719327746, 'administrator', 'UPDATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131719327747, 'manager', 'UPDATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131719327748, 'editor', 'UPDATE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131719327749, 'administrator', 'DELETE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131719327750, 'manager', 'DELETE_RECORD');
INSERT INTO `${table.prefix}node_role_resource_rel`(id,role_code,resource_code) VALUES (1233225131727716353, 'editor', 'DELETE_RECORD');

-- Init Node Resource Data
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147284389889, 'CREATE_NODE', 'Create Node', 0, 'With the role of this resource, you can create new folders and datasheets', 'childCreatable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147292778498, 'UPDATE_NODE', 'Update Node', 0, 'The role with this resource can edit the node and update the data of the node', 'editable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147292778499, 'RENAME_NODE', 'Rename Node', 0, 'Roles with this resource can rename nodes', 'renamable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147292778500, 'DELETE_NODE', 'Delete Node', 0, 'Roles with this resource can delete nodes', 'removable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147301167105, 'MOVE_NODE', 'Mobile Node', 0, 'Roles with this resource can move and adjust nodes hierarchically', 'movable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147305361409, 'READ_NODE', 'Read Node', 0, 'The role with this resource can read the data of the node', 'readable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147305361410, 'IMPORT_NODE', 'Import node', 0, 'The role with this resource can see the 「Import Datasheet」 button in the shortcut menu of the 「Work Directory」, and can perform the import operation', 'importable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147309555714, 'EXPORT_NODE', 'Export Node', 0, 'The role with this resource can see the 「Export」 button in the shortcut menu of the 「Work Directory」, and can perform the export operation', 'exportable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147309555715, 'DUPLICATE_NODE', 'Copy Node', 0, 'For the role with this resource, you can see the 「Copy Datasheet」 button in the shortcut menu of the 「Work Directory」, and you can copy the data table', 'copyable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750018, 'ASSIGN_NODE_ROLE', 'Assign Node Roles', 0, 'Roles with this resource can set role permissions on nodes. Assign a role to the 「Organizational Unit」 for the current node', 'nodeAssignable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750019, 'READ_VIEW', 'Read View', 1, 'The role with this resource can view the specified view of the datasheet', 'viewReadable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750020, 'RENAME_VIEW', 'Rename View', 1, 'The role with this resource can rename the view name of the datasheet', 'viewRenamable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750021, 'DELETE_VIEW', 'Delete View', 1, 'The role with this resource can delete the specified view of the datasheet', 'viewMovable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750022, 'UPDATE_VIEW_CONFIG', 'Update View Config', 1, 'The role with this resource can modify the configuration of the current view of the update datasheet', 'viewEditable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147313750023, 'LOCK_VIEW_CONFIG', 'Lock View', 1, 'The role with this resource can lock the specified view of the datasheet. The locked view cannot edit the configuration', 'viewLockable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138625, 'CREATE_FIELD', 'New Field', 2, 'The role with this resource can add new fields, include duplicate fields, to the datasheet', 'fieldCreatable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138626, 'UPDATE_FIELD', 'Update Field', 2, 'The role with this resource can update the exist field configuration in the datasheet', 'fieldEditable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138627, 'DELETE_FIELD', 'Delete Field', 2, 'Roles with this resource can delete exist fields in the datasheet', 'fieldMovable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138628, 'CREATE_RECORD', 'New Record', 3, 'With the role of this resource, you can insert records in the data table, include copy records', 'recordAddable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138629, 'READ_RECORD', 'Read Record', 3, 'With the role of this resource, you can view the record data in the datasheet', 'recordReadable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138630, 'UPDATE_RECORD', 'Update Records', 3, 'With the role of this resource, you can edit the record data in the datasheet', 'recordEditable');
INSERT INTO `${table.prefix}node_resource`(id,resource_code,resource_name,resource_type,resource_desc,field_name) VALUES (1233225147322138631, 'DELETE_RECORD', 'Delete Record', 3, 'With the role of this resource, you can delete exist records in the datasheet', 'recordMovable');
