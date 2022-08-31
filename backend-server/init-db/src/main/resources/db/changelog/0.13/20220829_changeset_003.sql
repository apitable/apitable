BEGIN;
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862018, 'MANAGE_ROLE', 'CREATE_ROLE', '添加角色', NULL, '具有此资源的角色，可以在目录树添加角色', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862020, 'MANAGE_ROLE', 'READ_ROLE', '读取角色', NULL, '具有此资源的角色，可以在目录树读取角色的数据', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862023, 'MANAGE_ROLE', 'UPDATE_ROLE', '更新角色', NULL, '具有此资源的角色，可以对角色进行编辑操作，更新角色的名称', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862025, 'MANAGE_ROLE', 'DELETE_ROLE', '删除角色', NULL, '具有此资源的角色，可以删除角色', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862027, 'MANAGE_ROLE', 'ADD_ROLE_MEMBER', '添加角色成员', NULL, '具有此资源的角色，可以在角色添加成员或部门', 1);
INSERT INTO `vika_space_resource`(id, group_code, resource_code, resource_name, resource_url, resource_desc, assignable)
VALUES (1560560432907862030, 'MANAGE_ROLE', 'REMOVE_ROLE_MEMBER', '移除角色成员', NULL, '具有此资源的角色，可以在角色移除成员或部门', 1);


INSERT INTO `vika_space_resource_group`(id, group_code, group_name, group_desc)
VALUES (1560560432907862035 , 'MANAGE_ROLE', '管理角色', '可进行新增、更新、删除角色等操作');
COMMIT;