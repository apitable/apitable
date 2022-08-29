UPDATE vika_space_menu SET menu_name = '工作台设置' WHERE menu_code = 'ManageWorkbench';

UPDATE vika_space_resource_group SET group_name = '管理工作台', group_desc = '可设置「工作台」的节点权限，并开启「禁止导出维格表」功能' WHERE group_code = 'MANAGE_WORKBENCH';

UPDATE vika_space_resource_group SET group_name = '普通成员设置', group_desc = '可开启普通成员「邀请成员」的功能' WHERE group_code = 'MANAGE_NORMAL_MEMBER';

UPDATE vika_space_resource_group SET group_name = '管理小组', group_desc = '可进行新增、修改、删除小组的操作' WHERE group_code = 'MANAGE_TEAM';

UPDATE vika_space_resource_group SET group_name = '管理成员', group_desc = '可进行邀请、编辑、移除成员的操作' WHERE group_code = 'MANAGE_MEMBER';
