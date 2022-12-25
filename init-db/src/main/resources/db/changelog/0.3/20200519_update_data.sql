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

UPDATE `${table.prefix}space_menu` SET menu_name = 'Workbench settings' WHERE menu_code = 'ManageWorkbench';

UPDATE `${table.prefix}space_resource_group` SET group_name = 'Management workbench', group_desc = 'You can set the node permissions of the 「Workbench」, and enable the function of 「Forbid Export Datasheet」' WHERE group_code = 'MANAGE_WORKBENCH';

UPDATE `${table.prefix}space_resource_group` SET group_name = 'Common member settings', group_desc = 'The function of 「invite members」 for ordinary members can be enabled' WHERE group_code = 'MANAGE_NORMAL_MEMBER';

UPDATE `${table.prefix}space_resource_group` SET group_name = 'Management Team', group_desc = 'Add, modify, and delete groups action' WHERE group_code = 'MANAGE_TEAM';

UPDATE `${table.prefix}space_resource_group` SET group_name = 'Manage Members', group_desc = 'Invite, edit and remove members action' WHERE group_code = 'MANAGE_MEMBER';
