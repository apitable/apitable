BEGIN;
-- Init Space Menu Data
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082666528770, NULL, 'SpaceOverview', '工作空间信息', NULL, 1);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082683305985, NULL, 'ManageWorkbench', '工作台管理', NULL, 2);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082683305986, NULL, 'ManageOrg', '通讯录管理', NULL, 3);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489082687500290, NULL, 'ManagePRMs', '权限管理', NULL, 4);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084566548482, 'ManageOrg', 'ManageOrg-ManageMember', '成员管理', NULL, 1);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084574937089, 'ManageOrg', 'ManageOrg-ManageTag', '标签管理', NULL, 2);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084579131394, 'ManagePRMs', 'ManagePRMs-MainAdmin', '主管理员', NULL, 1);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084583325697, 'ManagePRMs', 'ManagePRMs-SubAdmin', '子管理员', NULL, 2);
INSERT INTO `vika_space_menu`(id, parent_code, menu_code, menu_name, menu_url, sequence)
VALUES (1235489084587520001, 'ManagePRMs', 'ManagePRMs-Member', '普通成员', NULL, 3);

-- Init Space Menu Resource Rel Data
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096423845890, 'SpaceOverview', 'UPDATE_SPACE');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096428040193, 'SpaceOverview', 'DELETE_SPACE');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096428040194, 'ManageWorkbench', 'MANAGE_WORKBENCH_SETTING');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096432234497, 'ManageOrg-ManageMember', 'ADD_MEMBER');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096432234498, 'ManageOrg-ManageMember', 'INVITE_MEMBER');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096436428801, 'ManageOrg-ManageMember', 'READ_MEMBER');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096436428802, 'ManageOrg-ManageMember', 'UPDATE_MEMBER');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096440623106, 'ManageOrg-ManageMember', 'DELETE_MEMBER');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096440623107, 'ManageOrg-ManageMember', 'CREATE_TEAM');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817409, 'ManageOrg-ManageMember', 'READ_TEAM');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817410, 'ManageOrg-ManageMember', 'UPDATE_TEAM');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096444817411, 'ManageOrg-ManageMember', 'DELETE_TEAM');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011714, 'ManagePRMs-MainAdmin', 'READ_MAIN_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011715, 'ManagePRMs-MainAdmin', 'UPDATE_MAIN_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011716, 'ManagePRMs-SubAdmin', 'CREATE_SUB_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096449011717, 'ManagePRMs-SubAdmin', 'READ_SUB_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096453206017, 'ManagePRMs-SubAdmin', 'UPDATE_SUB_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096453206018, 'ManagePRMs-SubAdmin', 'DELETE_SUB_ADMIN');
INSERT INTO `vika_space_menu_resource_rel`(id, menu_code, resource_code)
VALUES (1235489096457400322, 'ManagePRMs-Member', 'MANAGE_MEMBER_SETTING');

-- Init Space Resource Data
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086525288450, 'MANAGE_SPACE', 'UPDATE_SPACE', '更新空间', NULL, '具有此资源的角色，可以编辑空间名、空间头像', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065665, 'MANAGE_SPACE', 'DELETE_SPACE', '删除空间', NULL, '具有此资源的角色，可以删除空间', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065667, 'MANAGE_WORKBENCH', 'MANAGE_WORKBENCH_SETTING', '管理配置', NULL,
        '具有此资源的角色，可以对“全员可见“和“禁止导出维格表”配置进行操作', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065669, 'MANAGE_MEMBER', 'ADD_MEMBER', '添加成员', NULL, '具有此资源的角色，可以在部门添加成员或在跟部门对成员进行分配部门操作', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065670, 'MANAGE_MEMBER', 'INVITE_MEMBER', '邀请成员', NULL, '具有此资源的角色，可以邀请新成员', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065671, 'MANAGE_MEMBER', 'READ_MEMBER', '读取成员', NULL, '具有此资源的角色，可以在部门查看成员数据', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065672, 'MANAGE_MEMBER', 'UPDATE_MEMBER', '更新成员', NULL, '具有此资源的角色，可以在部门编辑成员信息', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065673, 'MANAGE_MEMBER', 'DELETE_MEMBER', '删除成员', NULL, '具有此资源的角色，可以在部门删除/移除成员', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065675, 'MANAGE_TEAM', 'CREATE_TEAM', '添加部门', NULL, '具有此资源的角色，可以在目录树添加子部门', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065676, 'MANAGE_TEAM', 'READ_TEAM', '读取部门', NULL, '具有此资源的角色，可以在目录树读取部门的数据', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065677, 'MANAGE_TEAM', 'UPDATE_TEAM', '更新部门', NULL, '具有此资源的角色，可以对部门进行编辑操作，更新部门的名称', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065678, 'MANAGE_TEAM', 'DELETE_TEAM', '删除部门', NULL, '具有此资源的角色，可以删除部门', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086542065680, 'MANAGE_MAIN_ADMIN', 'READ_MAIN_ADMIN', '读取主管理员', NULL, '具有此资源的角色，可以读取主管理员数据', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259970, 'MANAGE_MAIN_ADMIN', 'UPDATE_MAIN_ADMIN', '更新主管理员', NULL, '具有此资源的角色，可以进行更换主管理员操作', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259972, 'MANAGE_SUB_ADMIN', 'CREATE_SUB_ADMIN', '添加子管理员', NULL, '具有此资源的角色，可以添加子管理员，并为子管理员配置权限', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259973, 'MANAGE_SUB_ADMIN', 'READ_SUB_ADMIN', '读取子管理员', NULL, '具有此资源的角色，可以读取子管理员数据', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259974, 'MANAGE_SUB_ADMIN', 'UPDATE_SUB_ADMIN', '更新子管理员', NULL, '具有此资源的角色，可以对子管理员进行编辑操作，更新子管理员数据',
        0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259975, 'MANAGE_SUB_ADMIN', 'DELETE_SUB_ADMIN', '删除子管理员', NULL, '具有此资源的角色，可以删除子管理员', 0);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1235489086546259977, 'MANAGE_NORMAL_MEMBER', 'MANAGE_MEMBER_SETTING', '管理配置', NULL,
        '具有此资源的角色，可以对“允许邀请成员”配置进行操作', 1);

-- Init Space Resource Group
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086521094145, 'MANAGE_SPACE', '管理空间信息', '编辑空间信息、空间头像、删除空间');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065666, 'MANAGE_WORKBENCH', '管理工作台', '配置“全员可见“和“禁止导出维格表”');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065668, 'MANAGE_MEMBER', '管理成员', '添加成员、邀请成员、读取成员、更新成员、删除成员');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065674, 'MANAGE_TEAM', '管理部门', '对部门操作');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086542065679, 'MANAGE_MAIN_ADMIN', '管理主管理员', '管理主管理员');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086546259971, 'MANAGE_SUB_ADMIN', '管理子管理员', '对子管理员操作');
INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1235489086546259976, 'MANAGE_NORMAL_MEMBER', '管理普通成员', '对普通成员操作');
COMMIT;
