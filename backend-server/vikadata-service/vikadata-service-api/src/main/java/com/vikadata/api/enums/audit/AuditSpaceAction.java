package com.vikadata.api.enums.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 空间审计事件枚举
 * </p>
 *
 * @author Chambers
 * @date 2022/5/25
 */
@Getter
@AllArgsConstructor
public enum AuditSpaceAction {

    /**
     * 创建空间站
     */
    CREATE_SPACE("create_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    /**
     * 修改空间站名称
     */
    RENAME_SPACE("rename_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    /**
     * 修改空间站Logo
     */
    UPDATE_SPACE_LOGO("update_space_logo", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    /**
     * 删除空间站（预删除，进入倒计时）
     */
    DELETE_SPACE("delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    /**
     * 撤销删除空间站
     */
    CANCEL_DELETE_SPACE("cancel_delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    /**
     * 彻底（立即）删除空间站
     */
    ACTUAL_DELETE_SPACE("actual_delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),


    /**
     * 创建节点
     */
    CREATE_NODE("create_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 修改节点名称
     */
    RENAME_NODE("rename_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 修改节点icon
     */
    UPDATE_NODE_ICON("update_node_icon", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 修改节点封面图
     */
    UPDATE_NODE_COVER("update_node_cover", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 修改节点描述
     */
    UPDATE_NODE_DESC("update_node_desc", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 导入Excel
     */
    IMPORT_NODE("import_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 复制节点
     */
    COPY_NODE("copy_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 移动节点（跨文件夹操作）
     */
    MOVE_NODE("move_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 排序节点（同一文件夹下操作）
     */
    SORT_NODE("sort_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 导出节点
     */
    EXPORT_NODE("export_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 删除节点
     */
    DELETE_NODE("delete_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 恢复回收站节点
     */
    RECOVER_RUBBISH_NODE("recover_rubbish_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 删除回收站节点
     */
    DELETE_RUBBISH_NODE("delete_rubbish_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 引用模板
     */
    QUOTE_TEMPLATE("quote_template", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 转存分享节点
     */
    STORE_SHARE_NODE("store_share_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    /**
     * 开启节点分享
     */
    ENABLE_NODE_SHARE("enable_node_share", AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    /**
     * 更改节点分享设置
     */
    UPDATE_NODE_SHARE_SETTING("update_node_share_setting", AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    /**
     * 关闭节点分享
     */
    DISABLE_NODE_SHARE("disable_node_share", AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    /**
     * 开启节点权限
     */
    ENABLE_NODE_ROLE("enable_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    /**
     * 关闭节点权限
     */
    DISABLE_NODE_ROLE("disable_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    /**
     * 添加节点角色
     */
    ADD_NODE_ROLE("add_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    /**
     * 修改节点角色
     */
    UPDATE_NODE_ROLE("update_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    /**
     * 删除节点角色
     */
    DELETE_NODE_ROLE("delete_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    /**
     * 创建模板
     */
    CREATE_TEMPLATE("create_template", AuditSpaceCategory.SPACE_TEMPLATE_EVENT),

    /**
     * 删除模板
     */
    DELETE_TEMPLATE("delete_template", AuditSpaceCategory.SPACE_TEMPLATE_EVENT),

    ;

    private final String action;

    private final AuditSpaceCategory category;
}
