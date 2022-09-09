ALTER table vika_asset
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_asset SET created_at = create_time;

ALTER table vika_asset_audit
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_asset_audit
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_asset_audit SET created_at = create_time, updated_at = update_time;

ALTER table vika_audit_invite_record
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_audit_invite_record SET created_at = create_time;

ALTER table vika_audit_space
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_audit_space
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_audit_space SET created_at = create_time, updated_at = update_time;

ALTER table vika_audit_upload_parse_record
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_audit_upload_parse_record SET created_at = create_time;

ALTER table vika_datasheet
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_datasheet
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_datasheet SET created_at = create_time, updated_at = update_time;

ALTER table vika_datasheet_changeset
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_datasheet_changeset
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_datasheet_changeset SET created_at = create_time, updated_at = update_time;

ALTER table vika_datasheet_meta
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_datasheet_meta
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_datasheet_meta SET created_at = create_time, updated_at = update_time;

ALTER table vika_datasheet_operation
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_datasheet_operation
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_datasheet_operation SET created_at = create_time, updated_at = update_time;

ALTER table vika_datasheet_record
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_datasheet_record
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_datasheet_record SET created_at = create_time, updated_at = update_time;

ALTER table vika_node
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node SET created_at = create_time, updated_at = update_time;

ALTER table vika_node_desc
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node_desc
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node_desc SET created_at = create_time, updated_at = update_time;

ALTER table vika_node_permission
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node_permission
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node_permission SET created_at = create_time;

ALTER table vika_node_resource
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node_resource
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node_resource SET created_at = create_time, updated_at = update_time;

ALTER table vika_node_role
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node_role
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node_role SET created_at = create_time, updated_at = update_time;

ALTER table vika_node_role_resource_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_node_role_resource_rel SET created_at = create_time;

ALTER table vika_node_share_operate
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_node_share_operate SET created_at = create_time;

ALTER table vika_node_share_setting
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_node_share_setting
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_node_share_setting SET created_at = create_time, updated_at = update_time;

ALTER TABLE vika_space
    ADD COLUMN `owner` bigint(20) DEFAULT NULL COMMENT '拥有者';
ALTER TABLE vika_space
    ADD COLUMN `creator` bigint(20) DEFAULT NULL COMMENT '创建者';
ALTER TABLE vika_space
    ADD COLUMN `created_by` bigint(20) DEFAULT NULL COMMENT '创建用户';
ALTER TABLE vika_space
    ADD COLUMN `updated_by` bigint(20) DEFAULT NULL COMMENT '最后一次更新用户';
ALTER table vika_space
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space SET creator = creator_member_id, owner = owner_member_id,  created_at = create_time, updated_at = update_time;

ALTER table vika_space_asset
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_asset
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_asset SET created_at = create_time, updated_at = update_time;

ALTER TABLE `vika_space_invite_record`
    CHANGE COLUMN `Invite_url` `invite_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邀请链接';

ALTER table vika_space_invite_link
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_invite_link
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_invite_link SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_invite_record
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_space_invite_record SET created_at = create_time;

ALTER table vika_space_member_role_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_member_role_rel
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_member_role_rel SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_menu
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_menu
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_menu SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_menu_resource_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_space_menu_resource_rel SET created_at = create_time;

ALTER table vika_space_resource
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_resource
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_resource SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_resource_group
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_resource_group
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_resource_group SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_role
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_space_role
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_space_role SET created_at = create_time, updated_at = update_time;

ALTER table vika_space_role_resource_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_space_role_resource_rel SET created_at = create_time;

ALTER table vika_unit
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_unit SET created_at = create_time;

ALTER table vika_unit_member
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_unit_member
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_unit_member SET created_at = create_time, updated_at = update_time;

ALTER table vika_unit_tag
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_unit_tag
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_unit_tag SET created_at = create_time, updated_at = update_time;

ALTER table vika_unit_tag_group
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_unit_tag_group
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_unit_tag_group SET created_at = create_time, updated_at = update_time;

ALTER table vika_unit_tag_member_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_unit_tag_member_rel
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_unit_tag_member_rel SET created_at = create_time, updated_at = update_time;

ALTER table vika_unit_team
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_unit_team
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_unit_team SET created_at = create_time, updated_at = update_time;

ALTER table vika_unit_team_member_rel
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
UPDATE vika_unit_team_member_rel SET created_at = create_time;

ALTER table vika_user
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_user
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_user SET created_at = create_time, updated_at = update_time;

ALTER table vika_user_link
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_user_link
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_user_link SET created_at = create_time, updated_at = update_time;

ALTER table vika_wechat_auth_permission
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_wechat_auth_permission
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_wechat_auth_permission SET created_at = create_time, updated_at = update_time;

ALTER table vika_wechat_authorization
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_wechat_authorization
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_wechat_authorization SET created_at = create_time, updated_at = update_time;

ALTER table vika_wechat_member
    ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER table vika_wechat_member
    ADD COLUMN `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
UPDATE vika_wechat_member SET created_at = create_time, updated_at = update_time;
