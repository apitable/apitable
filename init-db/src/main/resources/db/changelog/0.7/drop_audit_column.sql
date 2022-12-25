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

-- Delete redundant fields --
alter table ${table.prefix}asset drop create_time;

alter table ${table.prefix}asset_audit drop create_time, drop update_time;

alter table ${table.prefix}audit_invite_record drop create_time;

alter table ${table.prefix}audit_upload_parse_record drop create_time;

alter table ${table.prefix}datasheet drop create_time, drop update_time;

alter table ${table.prefix}node drop create_time, drop update_time;

alter table ${table.prefix}node_desc drop create_time,drop update_time;

alter table ${table.prefix}node_permission drop create_time;

alter table ${table.prefix}node_resource drop create_time,drop update_time;

alter table ${table.prefix}node_role drop create_time, drop update_time;

alter table ${table.prefix}node_role_resource_rel drop create_time;

alter table ${table.prefix}node_share_operate drop create_time;

alter table ${table.prefix}node_share_setting drop create_time, drop update_time;

alter table ${table.prefix}space drop creator_member_id, drop owner_member_id, drop node_visible, drop node_assignable, drop create_time, drop update_time;

alter table ${table.prefix}space_asset drop create_time,drop update_time;

alter table ${table.prefix}space_invite_link drop create_time, drop update_time;

alter table ${table.prefix}space_invite_record drop create_time;

alter table ${table.prefix}space_member_role_rel drop create_time, drop update_time;

alter table ${table.prefix}space_menu drop create_time, drop update_time;

alter table ${table.prefix}space_menu_resource_rel drop create_time;

alter table ${table.prefix}space_resource drop create_time, drop update_time;

alter table ${table.prefix}space_resource_group drop create_time, drop update_time;

alter table ${table.prefix}space_role drop create_time, drop update_time;

alter table ${table.prefix}space_role_resource_rel drop create_time;

alter table ${table.prefix}unit drop create_time;

alter table ${table.prefix}unit_member drop create_time, drop update_time;

alter table ${table.prefix}unit_tag drop create_time, drop update_time;

alter table ${table.prefix}unit_tag_group drop create_time , drop update_time;

alter table ${table.prefix}unit_tag_member_rel drop create_time, drop update_time;

alter table ${table.prefix}unit_team drop create_time, drop update_time;

alter table ${table.prefix}unit_team_member_rel drop create_time;

alter table ${table.prefix}user drop create_time,drop update_time;

alter table ${table.prefix}user_link drop create_time, drop update_time;

