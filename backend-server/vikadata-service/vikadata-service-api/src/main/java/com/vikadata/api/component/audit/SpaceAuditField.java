package com.vikadata.api.component.audit;

import cn.hutool.core.collection.CollUtil;

/**
 * <p>
 * 针对空间内隔离的审计记录
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/27 15:34
 */
public class SpaceAuditField extends AbstractAuditField {

    @Override
    protected void init() {
        // a创建了空间站b
        put("create_space", CollUtil.newHashSet("url", "user_id", "user_name", "space_name"));
        // a修改了空间站名称从b改成c
        put("rename_space", CollUtil.newHashSet("url", "user_id", "user_name", "old_value", "new_value"));
        // a离开了空间站
        put("user_leave_space", CollUtil.newHashSet("url", "user_id", "user_name", "member_id", "member_name", "space_id", "space_name"));
        put("delete_space", CollUtil.newHashSet("url", "user_id", "user_name", "member_id", "member_name", "space_id", "space_name"));
        put("actual_delete_space", CollUtil.newHashSet("url", "user_id", "user_name", "member_id", "member_name", "space_id", "space_name"));
        put("invite_user_join_by_email", CollUtil.newHashSet("url", "member_id", "member_name", "email"));
        // a通过用户b的加入申请
        put("agree_user_apply", CollUtil.newHashSet("url", "user_id", "user_name", "apply_user_id", "apply_user_name", "space_id", "space_name"));
        // a将成员b的属性c从d改成f
        put("update_member_property", CollUtil.newHashSet("url", "user_id", "user_name", "member_id", "member_name", "property", "before_value", "after_value"));
        // a将成员b的部门从c修改为d
        put("update_member_team", CollUtil.newHashSet("url", "member_id", "member_name", ""));
        // a将成员b移出小组c
        put("remove_member_from_team", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a将成员b移出空间站
        put("remove_user", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a创建了小组b
        put("create_team", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a将小组b的属性c从d改成f
        put("update_team_property", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a将b调整到小组c
        put("add_member_to_team", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a删除了小组b
        put("delete_team", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a改变主管理员从b改成c
        put("change_main_admin", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a添加了新的子管理员b
        put("add_sub_admin", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a修改子管理员b的权限
        put("update_sub_admin_role", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a删除了子管理员b
        put("delete_sub_admin", CollUtil.newHashSet("url", "member_id", "member_name", "space_id", "space_name"));
        // a在工作台新增了一个b（文件类型）
        put("create_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "parent_id", "parent_name"));
        // a将文件名称从b改成c
        put("rename_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "old_value", "new_value"));
        // a在工作目录导入了新的文件
        put("import_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "parent_id", "parent_name"));
        // a复制了节点
        put("copy_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "source_node_id", "source_node_name", "parent_id", "parent_name"));
        // a将上级为文件夹a的文件b移动到上级为文件夹c下
        put("move_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "parent_id", "parent_name", "pre_node_id"));
        // a导出了文件b
        put("export_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "parent_id", "parent_name", "pre_node_id"));
        // a删除了文件b(文件类型)
        put("delete_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name"));
        // a从回收站恢复了文件b
        put("recover_rubbish_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "parent_id", "parent_name"));
        // a删除了回收站的文件b
        put("delete_rubbish_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name"));
        // a开启了文件b的权限设置
        put("enable_node_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        // a关闭了文件b的权限设置
        put("disable_node_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        // a给文件b的权限添加了新的组织单元c
        put("add_node_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        // a将文件b的权限修改角色
        put("update_node_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        // a将文件b的成员c移除了权限
        put("delete_node_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        // a开启文件夹b里列c开启了权限
        put("enable_field_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("disable_field_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("add_field_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("update_field_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("delete_field_role", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("enable_node_share", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("update_node_share_setting", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "props"));
        put("disable_node_share", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name"));
        put("store_share_node", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "source_node_id", "source_node_name"));
        put("quote_template", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "template_id", "template_name", "parent_id", "parent_name"));
        put("add_template", CollUtil.newHashSet("url", "member_id", "member_name", "node_id", "node_name", "template_id", "template_name"));
        put("delete_template", CollUtil.newHashSet("url", "member_id", "member_name", "template_id", "template_name"));
    }

    @Override
    protected void initWrapper() {
        putFieldWrapperMethodName("member_name", "getMemberNameByMemberId");
        putFieldWrapperMethodName("space_name", "getSpaceNameBySpaceId");
        putFieldWrapperMethodName("node_name", "getNodeNameByNodeId");
        putFieldWrapperMethodName("parent_name", "getNodeNameByNodeId");
        putFieldWrapperMethodName("template_name", "getTemplateNameByTemplateId");
    }
}
