-- 原注释：基础-附件表
alter table `${table.prefix}asset` comment '资源表';

-- 原注释：基础-附件审核表
alter table `${table.prefix}asset_audit` comment '资源审核表';

-- 原注释：审计-邀请记录
alter table `${table.prefix}audit_invite_record` comment '邀请记录审计表';

-- 原注释：组织架构-通讯录文件上传解析表
alter table `${table.prefix}audit_upload_parse_record` comment '通讯录上传解析审计表';

-- 原注释：基础-附件表
alter table `${table.prefix}space_asset` comment '工作台-附件表';

-- 原注释：工作空间-公开邀请链接
alter table `${table.prefix}space_invite_link` comment '工作台-邀请链接表';

-- 原注释：组织架构-邀请成员记录
alter table `${table.prefix}space_invite_record` comment '工作台-邀请记录表';

-- 原注释：工作空间-角色权限关联表
alter table `${table.prefix}space_member_role_rel` comment '工作台-角色权限关联表';

-- 原注释：工作空间-菜单资源关联表
alter table `${table.prefix}space_menu_resource_rel` comment '工作台-菜单资源关联表';

-- 原注释：工作空间-权限资源表
alter table `${table.prefix}space_resource` comment '工作台-权限资源表';

-- 原注释：工作空间-权限资源分组表
alter table `${table.prefix}space_resource_group` comment '工作台-权限资源分组表';

-- 原注释：工作空间-角色表
alter table `${table.prefix}space_role` comment '工作台-角色表';

-- 原注释：工作空间-角色权限资源关联表
alter table `${table.prefix}space_role_resource_rel` comment '工作台-角色权限资源关联表';

-- 原注释：基础-帐号关联表
alter table `${table.prefix}user_link` comment '基础-用户第三方平台关联表';
