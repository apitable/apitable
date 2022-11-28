-- 删除多余字段 --
alter table ${table.prefix}asset drop create_time;

alter table ${table.prefix}asset_audit drop create_time, drop update_time;

alter table ${table.prefix}audit_invite_record drop create_time;

alter table ${table.prefix}audit_upload_parse_record drop create_time;

alter table ${table.prefix}audit_space drop create_time,drop update_time;

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

alter table ${table.prefix}wechat_auth_permission drop create_time, drop update_time;

alter table ${table.prefix}wechat_authorization drop create_time, drop update_time;

alter table ${table.prefix}wechat_member drop create_time, drop update_time;
