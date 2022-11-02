package com.vikadata.api.model.vo.node;

import java.util.Map;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * 数表拥有权限视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/24 17:57
 */
@Data
@ApiModel("数表拥有权限视图")
public class DatasheetPermissionView {

    @ApiModelProperty(value = "节点ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @ApiModelProperty(value = "数表ID（节点ID / 源数表节点ID / null）", example = "dstGxznHFXf9pvF1LZ", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "节点是否是星标", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @ApiModelProperty(value = "是否拥有权限", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasRole;

    @ApiModelProperty(value = "角色", example = "true", position = 1)
    private String role;

    @ApiModelProperty(value = "是否是幽灵节点", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isGhostNode;

    @ApiModelProperty(value = "当前用户数据库标识", example = "123", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;

    @ApiModelProperty(value = "当前用户唯一标识", example = "123", position = 1)
    private String uuid;

    @ApiModelProperty(value = "可管理的", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @ApiModelProperty(value = "可编辑的", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean editable;

    @ApiModelProperty(value = "可查看的", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean readable;

    @ApiModelProperty(value = "可以创建子节点", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean childCreatable;

    @ApiModelProperty(value = "可重命名的", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean renamable;

    @ApiModelProperty(value = "可编辑图标的", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean iconEditable;

    @ApiModelProperty(value = "可节点描述编辑", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean descriptionEditable;

    @ApiModelProperty(value = "可移动节点", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean movable;

    @ApiModelProperty(value = "可复制节点", example = "true", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean copyable;

    @ApiModelProperty(value = "可导入的", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean importable;

    @ApiModelProperty(value = "可导出的", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean exportable;

    @ApiModelProperty(value = "可删除节点", example = "true", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean removable;

    @ApiModelProperty(value = "可允许分享节点", example = "true", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean sharable;

    @ApiModelProperty(value = "可设置节点允许他人保存", example = "true", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaveConfigurable;

    @ApiModelProperty(value = "可设置节点允许他人编辑", example = "true", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEditConfigurable;

    @ApiModelProperty(value = "可创建为模板", example = "true", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean templateCreatable;

    @ApiModelProperty(value = "新增视图", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewCreatable;

    @ApiModelProperty(value = "重命名视图", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRenamable;

    @ApiModelProperty(value = "删除视图", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRemovable;

    @ApiModelProperty(value = "移动视图", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewMovable;

    @ApiModelProperty(value = "导出视图", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewExportable;

    @ApiModelProperty(value = "筛选列", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewFilterable;

    @ApiModelProperty(value = "排序列", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnSortable;

    @ApiModelProperty(value = "隐藏列", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnHideable;

    @ApiModelProperty(value = "编辑列顺序", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldSortable;

    @ApiModelProperty(value = "分组", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldGroupable;

    @ApiModelProperty(value = "编辑行高", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowHighEditable;

    @ApiModelProperty(value = "编辑列宽", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnWidthEditable;

    @ApiModelProperty(value = "编辑列统计", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnCountEditable;

    @ApiModelProperty(value = "行排序", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowSortable;

    @ApiModelProperty(value = "新增字段", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldCreatable;

    @ApiModelProperty(value = "重命名字段", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRenamable;

    @ApiModelProperty(value = "编辑字段属性", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPropertyEditable;

    @ApiModelProperty(value = "删除字段", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRemovable;

    @ApiModelProperty(value = "新增行", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowCreatable;

    @ApiModelProperty(value = "删除行", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowRemovable;

    @ApiModelProperty(value = "编辑单元格", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean cellEditable;

    @ApiModelProperty(value = "是否可以管理列权限", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPermissionManageable;

    @ApiModelProperty(value = "编辑视图布局", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewLayoutEditable;

    @ApiModelProperty(value = "编辑视图样式", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewStyleEditable;

    @ApiModelProperty(value = "编辑视图关键字段", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewKeyFieldEditable;

    @ApiModelProperty(value = "编辑视图颜色选项", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewColorOptionEditable;

    @ApiModelProperty(value = "视图锁定可管理", example = "true", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewLockManageable;

    @ApiModelProperty(value = "视图手动保存可管理", example = "true", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewManualSaveManageable;

    @ApiModelProperty(value = "视图选项保存可编辑", example = "true", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewOptionSaveEditable;

    @ApiModelProperty(value = "数表字段权限信息", dataType = "java.util.Map", position = 27)
    private Map<String, FieldPermissionInfo> fieldPermissionMap;
}
