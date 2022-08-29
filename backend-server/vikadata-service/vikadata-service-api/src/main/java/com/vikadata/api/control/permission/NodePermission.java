package com.vikadata.api.control.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 节点权限点
 * 一一对应功能点
 * 一个功能对应Long型64位的某一个占位
 * 每个Group下的位移数是唯一的，不可以重复
 * 此处代表数据库存储，减少数据库查询
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/25 14:33
 */
@Getter
@AllArgsConstructor
public enum NodePermission implements PermissionDefinition {

    /**
     * 管理节点
     */
    MANAGE_NODE("manageable", 0, 1L),

    /**
     * 编辑节点
     */
    EDIT_NODE("editable", 0, 1L << 1),

    /**
     * 读取节点
     */
    READ_NODE("readable", 0, 1L << 2),

    /**
     * 创建子节点
     */
    CREATE_NODE("childCreatable", 0, 1L << 3),

    /**
     * 重命名节点
     */
    RENAME_NODE("renamable", 0, 1L << 4),

    /**
     * 编辑节点图标
     */
    EDIT_NODE_ICON("iconEditable", 0, 1L << 5),

    /**
     * 编辑节点描述
     */
    EDIT_NODE_DESC("descriptionEditable", 0, 1L << 6),

    /**
     * 移动排序节点
     */
    MOVE_NODE("movable", 0, 1L << 7),

    /**
     * 可复制节点
     */
    COPY_NODE("copyable", 0, 1L << 8),

    /**
     * 导入节点
     */
    IMPORT_NODE("importable", 0, 1L << 9),

    /**
     * 导出节点
     */
    EXPORT_NODE("exportable", 0, 1L << 10),

    /**
     * 删除节点
     */
    REMOVE_NODE("removable", 0, 1L << 11),

    /**
     * 读取节点分享信息
     */
    SHARE_NODE("sharable", 0, 1L << 12),

    /**
     * 设置节点允许他人保存状态
     */
    SET_NODE_SHARE_ALLOW_SAVE("allowSaveConfigurable", 0, 1L << 13),

    /**
     * 设置节点允许他人编辑状态
     */
    SET_NODE_SHARE_ALLOW_EDIT("allowEditConfigurable", 0, 1L << 14),

    /**
     * 配置节点权限
     */
    ASSIGN_NODE_ROLE("nodeAssignable", 0, 1L << 15),

    /**
     * 创建模板
     */
    CREATE_TEMPLATE("templateCreatable", 0, 1L << 16),

    CREATE_VIEW("viewCreatable", 1, 1L),

    RENAME_VIEW("viewRenamable", 1, 1L << 1),

    REMOVE_VIEW("viewRemovable", 1, 1L << 2),

    MOVE_VIEW("viewMovable", 1, 1L << 3),

    EXPORT_VIEW("viewExportable", 1, 1L << 4),

    FILTER_VIEW("viewFilterable", 1, 1L << 5),

    SORT_COLUMN("columnSortable", 1, 1L << 6),

    HIDE_COLUMN("columnHideable", 1, 1L << 7),

    SORT_FIELD("fieldSortable", 1, 1L << 8),

    GROUP_FIELD("fieldGroupable", 1, 1L << 9),

    EDIT_ROW_HIGH("rowHighEditable", 1, 1L << 10),

    EDIT_COLUMN_WIDTH("columnWidthEditable", 1, 1L << 11),

    EDIT_COLUMN_COUNT("columnCountEditable", 1, 1L << 12),

    CREATE_FIELD("fieldCreatable", 1, 1L << 13),

    RENAME_FIELD("fieldRenamable", 1, 1L << 14),

    EDIT_FIELD_PROPERTY("fieldPropertyEditable", 1, 1L << 15),

    REMOVE_FIELD("fieldRemovable", 1, 1L << 16),

    CREATE_ROW("rowCreatable", 1, 1L << 17),

    REMOVE_ROW("rowRemovable", 1, 1L << 18),

    EDIT_CELL("cellEditable", 1, 1L << 19),

    SORT_ROW("rowSortable", 1, 1L << 20),

    MANAGE_FIELD_PERMISSION("fieldPermissionManageable", 1, 1L << 21),

    EDIT_VIEW_LAYOUT("viewLayoutEditable", 1, 1L << 22),

    EDIT_VIEW_STYLE("viewStyleEditable", 1, 1L << 23),

    EDIT_VIEW_KEY_FIELD("viewKeyFieldEditable", 1, 1L << 24),

    EDIT_VIEW_COLOR_OPTION("viewColorOptionEditable", 1, 1L << 25),

    /**
     * 视图锁定可管理
     */
    MANAGE_VIEW_LOCK("viewLockManageable", 1, 1L << 26),

    /**
     * 视图手动保存可管理
     */
    MANAGE_VIEW_MANUAL_SAVE("viewManualSaveManageable", 1, 1L << 27),

    /**
     * 视图选项保存可编辑
     */
    EDIT_VIEW_OPTION_SAVE("viewOptionSaveEditable", 1, 1L << 28);

    /**
     * 同一组下唯一权限代号，不能重复
     */
    private final String code;

    /**
     * 权限位，分组的概念，long型最大容纳63个权限位，超过63个则group+1
     */
    private final int group;

    /**
     * 权限码，Long型空间的位置,从0开始
     */
    private final long value;

}
