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

-- Init Space Menu Data
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082666528770, NULL, 'SpaceOverview', 'Workspace Information', NULL, 1);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082683305985, NULL, 'ManageWorkbench', 'Workbench Management', NULL, 2);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082683305986, NULL, 'ManageOrg', 'Address Book Management', NULL, 3);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082687500290, NULL, 'ManagePRMs', 'Permission Management', NULL, 4);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084566548482, 'ManageOrg', 'ManageOrg-ManageMember', 'Member Management', NULL, 1);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084574937089, 'ManageOrg', 'ManageOrg-ManageTag', 'Tag Management', NULL, 2);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084579131394, 'ManagePRMs', 'ManagePRMs-MainAdmin', 'Primary Administrator', NULL, 1);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084583325697, 'ManagePRMs', 'ManagePRMs-SubAdmin', 'Sub Administrator', NULL, 2);
INSERT INTO `${table.prefix}space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084587520001, 'ManagePRMs', 'ManagePRMs-Member', 'Ordinary Members', NULL, 3);

-- Init Space Menu Resource Rel Data
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096423845890, 'SpaceOverview', 'UPDATE_SPACE');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096428040193, 'SpaceOverview', 'DELETE_SPACE');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096428040194, 'ManageWorkbench', 'MANAGE_WORKBENCH_SETTING');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096432234497, 'ManageOrg-ManageMember', 'ADD_MEMBER');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096432234498, 'ManageOrg-ManageMember', 'INVITE_MEMBER');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096436428801, 'ManageOrg-ManageMember', 'READ_MEMBER');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096436428802, 'ManageOrg-ManageMember', 'UPDATE_MEMBER');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096440623106, 'ManageOrg-ManageMember', 'DELETE_MEMBER');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096440623107, 'ManageOrg-ManageMember', 'CREATE_TEAM');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817409, 'ManageOrg-ManageMember', 'READ_TEAM');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817410, 'ManageOrg-ManageMember', 'UPDATE_TEAM');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817411, 'ManageOrg-ManageMember', 'DELETE_TEAM');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011714, 'ManagePRMs-MainAdmin', 'READ_MAIN_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011715, 'ManagePRMs-MainAdmin', 'UPDATE_MAIN_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011716, 'ManagePRMs-SubAdmin', 'CREATE_SUB_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011717, 'ManagePRMs-SubAdmin', 'READ_SUB_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096453206017, 'ManagePRMs-SubAdmin', 'UPDATE_SUB_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096453206018, 'ManagePRMs-SubAdmin', 'DELETE_SUB_ADMIN');
INSERT INTO `${table.prefix}space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096457400322, 'ManagePRMs-Member', 'MANAGE_MEMBER_SETTING');

-- Init Space Resource Data
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086525288450, 'MANAGE_SPACE', 'UPDATE_SPACE', 'Update Space', NULL, 'Roles with this resource can edit space name and space avatar', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065665, 'MANAGE_SPACE', 'DELETE_SPACE', 'Delete Space', NULL, 'Roles with this resource can delete spaces', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065667, 'MANAGE_WORKBENCH', 'MANAGE_WORKBENCH_SETTING', 'Manage Configuration', NULL,
        'The role with this resource can operate on the configurations of "Visible to All" and "Forbid Export Datasheet"', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065669, 'MANAGE_MEMBER', 'ADD_MEMBER', 'Add Members', NULL, 'Roles with this resource can add members in the department or assign departments to members in the department', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065670, 'MANAGE_MEMBER', 'INVITE_MEMBER', 'Invite members', NULL, 'Roles with this resource can invite new members', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065671, 'MANAGE_MEMBER', 'READ_MEMBER', 'Read Members', NULL, 'Roles with this resource can view member data in the department', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065672, 'MANAGE_MEMBER', 'UPDATE_MEMBER', 'Update Members', NULL, 'Roles with this resource can edit member information in the department', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065673, 'MANAGE_MEMBER', 'DELETE_MEMBER', 'Delete Member', NULL, 'Roles with this resource can be deleted or removed from the department', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065675, 'MANAGE_TEAM', 'CREATE_TEAM', 'Add Department', NULL, 'Roles with this resource can add sub departments in the directory tree', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065676, 'MANAGE_TEAM', 'READ_TEAM', 'Read department', NULL, 'The role with this resource can read department data in the directory tree', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065677, 'MANAGE_TEAM', 'UPDATE_TEAM', 'Update department', NULL, 'Roles with this resource can edit departments and update their names', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065678, 'MANAGE_TEAM', 'DELETE_TEAM', 'Delete Department', NULL, 'Roles with this resource can delete departments', 1);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065680, 'MANAGE_MAIN_ADMIN', 'READ_MAIN_ADMIN', 'Read Master Admin', NULL, 'With the role of this resource, you can read the master administrator data', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259970, 'MANAGE_MAIN_ADMIN', 'UPDATE_MAIN_ADMIN', 'Update Master Admin', NULL, 'With the role of this resource, you can change the master administrator', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259972, 'MANAGE_SUB_ADMIN', 'CREATE_SUB_ADMIN', 'Add Sub Admin', NULL, 'With the role of this resource, you can add sub administrators and configure permissions for them', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259973, 'MANAGE_SUB_ADMIN', 'READ_SUB_ADMIN', 'Read Sub Admin', NULL, 'The role with this resource can read sub administrator data', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259974, 'MANAGE_SUB_ADMIN', 'UPDATE_SUB_ADMIN', 'Update Sub Admin', NULL, 'With the role of this resource, you can edit sub administrators and update their data',
        0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259975, 'MANAGE_SUB_ADMIN', 'DELETE_SUB_ADMIN', 'Delete Sub Admin', NULL, 'The role with this resource can delete sub administrators', 0);
INSERT INTO `${table.prefix}space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259977, 'MANAGE_NORMAL_MEMBER', 'MANAGE_MEMBER_SETTING', 'Manage Configuration', NULL,
        'The role with this resource can operate on the "Allow inviting members" configuration', 1);

-- Init Space Resource Group
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086521094145, 'MANAGE_SPACE', 'Manage Space Information', 'Edit space information, space avatar, delete space');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065666, 'MANAGE_WORKBENCH', 'Management Workbench', 'Configure "Visible to All" and "Forbid Export Datasheet"');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065668, 'MANAGE_MEMBER', 'Manage Members', 'Add members, invite members, read members, update members, delete members');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065674, 'MANAGE_TEAM', 'Manage Department', 'Operation on department');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065679, 'MANAGE_MAIN_ADMIN', 'Manage Main Administrator', 'Manage main administrator');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086546259971, 'MANAGE_SUB_ADMIN', 'Manage Sub Administrators', 'Operation on sub administrator');
INSERT INTO `${table.prefix}space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086546259976, 'MANAGE_NORMAL_MEMBER', 'Manage Ordinary Members', 'Operation on normal members');
