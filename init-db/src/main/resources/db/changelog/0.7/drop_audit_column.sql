-- 删除多余字段 --
alter table vika_asset drop create_time;

alter table vika_asset_audit drop create_time, drop update_time;

alter table vika_audit_invite_record drop create_time;

alter table vika_audit_upload_parse_record drop create_time;

alter table vika_audit_space drop create_time,drop update_time;

alter table vika_datasheet drop create_time, drop update_time;

alter table vika_node drop create_time, drop update_time;

alter table vika_node_desc drop create_time,drop update_time;

alter table vika_node_permission drop create_time;

alter table vika_node_resource drop create_time,drop update_time;

alter table vika_node_role drop create_time, drop update_time;

alter table vika_node_role_resource_rel drop create_time;

alter table vika_node_share_operate drop create_time;

alter table vika_node_share_setting drop create_time, drop update_time;

alter table vika_space drop creator_member_id, drop owner_member_id, drop node_visible, drop node_assignable, drop create_time, drop update_time;

alter table vika_space_asset drop create_time,drop update_time;

alter table vika_space_invite_link drop create_time, drop update_time;

alter table vika_space_invite_record drop create_time;

alter table vika_space_member_role_rel drop create_time, drop update_time;

alter table vika_space_menu drop create_time, drop update_time;

alter table vika_space_menu_resource_rel drop create_time;

alter table vika_space_resource drop create_time, drop update_time;

alter table vika_space_resource_group drop create_time, drop update_time;

alter table vika_space_role drop create_time, drop update_time;

alter table vika_space_role_resource_rel drop create_time;

alter table vika_unit drop create_time;

alter table vika_unit_member drop create_time, drop update_time;

alter table vika_unit_tag drop create_time, drop update_time;

alter table vika_unit_tag_group drop create_time , drop update_time;

alter table vika_unit_tag_member_rel drop create_time, drop update_time;

alter table vika_unit_team drop create_time, drop update_time;

alter table vika_unit_team_member_rel drop create_time;

alter table vika_user drop create_time,drop update_time;

alter table vika_user_link drop create_time, drop update_time;

alter table vika_wechat_auth_permission drop create_time, drop update_time;

alter table vika_wechat_authorization drop create_time, drop update_time;

alter table vika_wechat_member drop create_time, drop update_time;
