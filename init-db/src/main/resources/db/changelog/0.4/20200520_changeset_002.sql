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

-- Original Note: Basic - Attachment
alter table `${table.prefix}asset` comment 'Resource Table';

-- Original Note: Basic - Attachment Review
alter table `${table.prefix}asset_audit` comment 'Resource Audit Table';

-- Original Note: Audit - Invitation Record
alter table `${table.prefix}audit_invite_record` comment 'Invitation Record Audit Table';

-- Original note: Organization Structure - Address Book File Upload Analysis Table
alter table `${table.prefix}audit_upload_parse_record` comment 'Address Book Upload Analysis Audit Table';

-- Original Note: Basic - Attachment Table
alter table `${table.prefix}space_asset` comment 'Workbench - Attachment Table';

-- Original Note: Workspace - Public Invitation Link
alter table `${table.prefix}space_invite_link` comment 'Workbench - Invitation Link Table';

-- Original Note: Organization Structure - Invited Member Record
alter table `${table.prefix}space_invite_record` comment 'Workbench - Invitation Record Table';

-- Original note: Workspace - Role Permission Association Table
alter table `${table.prefix}space_member_role_rel` comment 'Workbench - Role Permission Association Table';

-- Original note: Workspace - Menu Resource Association Table
alter table `${table.prefix}space_menu_resource_rel` comment 'Workbench - Menu Resource Association Table';

-- Original note: Workspace - Permission Resource Table
alter table `${table.prefix}space_resource` comment 'Workbench - Permission Resource Table';

-- Original note: Workspace - Permission Resource Group Table
alter table `${table.prefix}space_resource_group` comment 'Workbench - Permission Resource Group Table';

-- Original note: Workspace - Role Table
alter table `${table.prefix}space_role` comment 'Workbench - Role Table';

-- Original note: Workspace Role Permission Resource Association Table
alter table `${table.prefix}space_role_resource_rel` comment 'Workbench - Role Permission Resource Association Table';

-- Original note: Basic -  Account Association Table
alter table `${table.prefix}user_link` comment 'Basic - User Third Party Platform Association Table';
