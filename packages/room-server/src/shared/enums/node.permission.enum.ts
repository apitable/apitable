/**
 * <p>
 * 节点权限合集, 对应 NodePermission 的字段
 * </p>
 * @author Zoe zheng
 * @date 2020/8/14 5:37 下午
 */
export enum NodePermissionEnum {
  /**
   * 可管理的
   */
  MANAGEABLE = 'manageable',
  /**
   * 可编辑的
   */
  EDITABLE = 'editable',
  /**
   * 可查看的
   */
  READABLE = 'readable',
  /**
   * 可以创建子节点
   */
  CHILD_CREATABLE = 'childCreatable',
  /**
   * 可重命名的
   */
  RENAMABLE = 'renamable',
  /**
   * 可编辑图标的
   */
  ICON_EDITABLE = 'iconEditable',
  /**
   * 可节点描述编辑
   */
  DESCRIPTION_EDITABLE = 'descriptionEditable',
  /**
   * 可移动节点
   */
  MOVABLE = 'movable',
  /**
   * 可复制节点
   */
  COPYABLE = 'copyable',
  /**
   * 可导入的
   */
  IMPORTABLE = 'importable',
  /**
   * 可导出的
   */
  EXPORTABLE = 'exportable',
  /**
   * 可删除节点
   */
  REMOVABLE = 'removable',
  /**
   * 可允许分享节点
   */
  SHARABLE = 'sharable',
  /**
   * 可设置节点允许他人保存
   */
  ALLOW_SAVE_CONFIGURABLE = 'allowSaveConfigurable',
  /**
   * 可设置节点允许他人编辑
   */
  ALLOW_EDIT_CONFIGURABLE = 'allowEditConfigurable',
  /**
   * 可创建为模板
   */
  TEMPLATE_CREATABLE = 'templateCreatable',
  /**
   * 新增视图
   */
  VIEW_CREATABLE = 'viewCreatable',
  /**
   * 重命名视图
   */
  VIEW_RENAMABLE = 'viewRenamable',
  /**
   * 删除视图
   */
  VIEW_REMOVABLE = 'viewRemovable',
  /**
   * 移动视图
   */
  VIEW_MOVABLE = 'viewMovable',
  /**
   * 导出视图
   */
  VIEW_EXPORTABLE = 'viewExportable',
  /**
   * 筛选列
   */
  VIEW_FILTERABLE = 'viewFilterable',
  /**
   * 排序record/rows
   */
  COLUMN_SORTABLE = 'columnSortable',
  /**
   * 隐藏列
   */
  COLUMN_HIDEABLE = 'columnHideable',
  /**
   * 编辑列顺序
   */
  FIELD_SORTABLE = 'fieldSortable',
  /**
   * 分组
   */
  FIELD_GROUPABLE = 'fieldGroupable',
  /**
   * 编辑行高
   */
  ROW_HIGH_EDITABLE = 'rowHighEditable',
  /**
   * 编辑列宽
   */
  COLUMN_WIDTH_EDITABLE = 'columnWidthEditable',
  /**
   * 编辑列统计
   */
  COLUMN_COUNT_EDITABLE = 'columnCountEditable',
  /**
   * 新增字段
   */
  FIELD_CREATABLE = 'fieldCreatable',
  /**
   * 重命名字段
   */
  FIELD_RENAMABLE = 'fieldRenamable',
  /**
   * 编辑字段属性
   */
  FIELD_PROPERTY_EDITABLE = 'fieldPropertyEditable',
  /**
   * 删除字段
   */
  FIELD_REMOVABLE = 'fieldRemovable',
  /**
   * 新增行
   */
  ROW_CREATABLE = 'rowCreatable',
  /**
   * 删除行
   */
  ROW_REMOVABLE = 'rowRemovable',
  /**
   * 编辑单元格
   */
  CELL_EDITABLE = 'cellEditable',
}
