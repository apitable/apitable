package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * Node has permission view
 * </p>
 */
@Data
@ApiModel("Node has permission view")
public class NodePermissionView {

    @ApiModelProperty(value = "Manageable", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @ApiModelProperty(value = "Editable", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean editable;

    @ApiModelProperty(value = "Viewable", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean readable;

    @ApiModelProperty(value = "Can create child nodes", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean childCreatable;

    @ApiModelProperty(value = "Renamable", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean renamable;

    @ApiModelProperty(value = "Editable icon", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean iconEditable;

    @ApiModelProperty(value = "Editable node description", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean descriptionEditable;

    @ApiModelProperty(value = "Movable node", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean movable;

    @ApiModelProperty(value = "Replicable node", example = "true", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean copyable;

    @ApiModelProperty(value = "Importable", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean importable;

    @ApiModelProperty(value = "Exportable", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean exportable;

    @ApiModelProperty(value = "Deletable nodes", example = "true", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean removable;

    @ApiModelProperty(value = "Allow share nodes", example = "true", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean sharable;

    @ApiModelProperty(value = "The node can be set to allow others to save", example = "true", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaveConfigurable;

    @ApiModelProperty(value = "The node can be set to allow others to edit", example = "true", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEditConfigurable;

    @ApiModelProperty(value = "Can be created as a template", example = "true", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean templateCreatable;

    @ApiModelProperty(value = "Node permissions can be assigned", example = "true", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeAssignable;

    @ApiModelProperty(value = "New View", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewCreatable;

    @ApiModelProperty(value = "Rename View", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRenamable;

    @ApiModelProperty(value = "Delete View", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRemovable;

    @ApiModelProperty(value = "Move View", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewMovable;

    @ApiModelProperty(value = "Export View", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewExportable;

    @ApiModelProperty(value = "Filter Columns", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewFilterable;

    @ApiModelProperty(value = "Sort Columns", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnSortable;

    @ApiModelProperty(value = "Hide Columns", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnHideable;

    @ApiModelProperty(value = "Edit Column Order", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldSortable;

    @ApiModelProperty(value = "Group", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldGroupable;

    @ApiModelProperty(value = "Edit Row Height", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowHighEditable;

    @ApiModelProperty(value = "Edit Column Width", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnWidthEditable;

    @ApiModelProperty(value = "Edit Column Statistics", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnCountEditable;

    @ApiModelProperty(value = "Row sort", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowSortable;

    @ApiModelProperty(value = "New Field", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldCreatable;

    @ApiModelProperty(value = "Rename Field", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRenamable;

    @ApiModelProperty(value = "Edit Field Properties", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPropertyEditable;

    @ApiModelProperty(value = "Delete Field", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRemovable;

    @ApiModelProperty(value = "New Row", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowCreatable;

    @ApiModelProperty(value = "Delete Row", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowRemovable;

    @ApiModelProperty(value = "Edit Cell", example = "true", position = 24)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean cellEditable;

    @ApiModelProperty(value = "Whether column permissions can be managed", example = "true", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPermissionManageable;
}
