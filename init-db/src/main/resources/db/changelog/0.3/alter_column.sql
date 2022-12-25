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

ALTER table `${table.prefix}asset`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}asset` SET created_at = create_time;

ALTER table `${table.prefix}asset_audit`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}asset_audit`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}asset_audit` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}audit_invite_record`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}audit_invite_record` SET created_at = create_time;

ALTER table `${table.prefix}audit_upload_parse_record`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}audit_upload_parse_record` SET created_at = create_time;

ALTER table `${table.prefix}datasheet`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}datasheet`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}datasheet` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}datasheet_changeset`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}datasheet_changeset`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}datasheet_changeset` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}datasheet_meta`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}datasheet_meta`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}datasheet_meta` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}datasheet_operation`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}datasheet_operation`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}datasheet_operation` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}datasheet_record`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}datasheet_record`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}datasheet_record` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}node`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}node_desc`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node_desc`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node_desc` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}node_permission`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node_permission`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node_permission` SET created_at = create_time;

ALTER table `${table.prefix}node_resource`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node_resource`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node_resource` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}node_role`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node_role`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node_role` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}node_role_resource_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}node_role_resource_rel` SET created_at = create_time;

ALTER table `${table.prefix}node_share_operate`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}node_share_operate` SET created_at = create_time;

ALTER table `${table.prefix}node_share_setting`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}node_share_setting`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}node_share_setting` SET created_at = create_time, updated_at = update_time;

ALTER TABLE `${table.prefix}space`
    ADD COLUMN `owner` bigint(20) DEFAULT NULL COMMENT 'Owner';
ALTER TABLE `${table.prefix}space`
    ADD COLUMN `creator` bigint(20) DEFAULT NULL COMMENT 'Creator';
ALTER TABLE `${table.prefix}space`
    ADD COLUMN `created_by` bigint(20) DEFAULT NULL COMMENT 'Create User';
ALTER TABLE `${table.prefix}space`
    ADD COLUMN `updated_by` bigint(20) DEFAULT NULL COMMENT 'Last Update User';
ALTER table `${table.prefix}space`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space` SET creator = creator_member_id, owner = owner_member_id,  created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_asset`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_asset`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_asset` SET created_at = create_time, updated_at = update_time;

ALTER TABLE `${table.prefix}space_invite_record`
    CHANGE COLUMN `Invite_url` `invite_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Invite Link';

ALTER table `${table.prefix}space_invite_link`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_invite_link`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_invite_link` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_invite_record`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}space_invite_record` SET created_at = create_time;

ALTER table `${table.prefix}space_member_role_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_member_role_rel`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_member_role_rel` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_menu`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_menu`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_menu` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_menu_resource_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}space_menu_resource_rel` SET created_at = create_time;

ALTER table `${table.prefix}space_resource`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_resource`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_resource` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_resource_group`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_resource_group`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_resource_group` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_role`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}space_role`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}space_role` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}space_role_resource_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}space_role_resource_rel` SET created_at = create_time;

ALTER table `${table.prefix}unit`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}unit` SET created_at = create_time;

ALTER table `${table.prefix}unit_member`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}unit_member`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}unit_member` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}unit_tag`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}unit_tag`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}unit_tag` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}unit_tag_group`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}unit_tag_group`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}unit_tag_group` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}unit_tag_member_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}unit_tag_member_rel`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}unit_tag_member_rel` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}unit_team`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}unit_team`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}unit_team` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}unit_team_member_rel`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
UPDATE `${table.prefix}unit_team_member_rel` SET created_at = create_time;

ALTER table `${table.prefix}user`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}user`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}user` SET created_at = create_time, updated_at = update_time;

ALTER table `${table.prefix}user_link`
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time';
ALTER table `${table.prefix}user_link`
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time';
UPDATE `${table.prefix}user_link` SET created_at = create_time, updated_at = update_time;
