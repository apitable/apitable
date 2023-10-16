/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

/**
 * <p>
 * Datasheet permission view.
 * </p>
 */
@Data
@Schema(description = "Datasheet permission view")
public class DatasheetPermissionView {

    @Schema(description = "Node ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @Schema(description = "DatasheetID（Node ID / Source Datasheet Node ID / null）",
        example = "dstGxznHFXf9pvF1LZ")
    private String datasheetId;

    @Schema(description = "Whether the node is a star")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @Schema(description = "Whether you have permission", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasRole;

    @Schema(description = "Role", example = "true")
    private String role;

    @Schema(description = "Is it a ghost node", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isGhostNode;

    @Schema(description = "Current user database ID", example = "123")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;

    @Schema(description = "Unique ID of the current user", example = "123")
    private String uuid;

    @Schema(description = "Manageable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @Schema(description = "Editable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean editable;

    @Schema(description = "Viewable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean readable;

    @Schema(description = "Can create child nodes", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean childCreatable;

    @Schema(description = "Renamable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean renamable;

    @Schema(description = "Editable icon", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean iconEditable;

    @Schema(description = "Editable node description", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean descriptionEditable;

    @Schema(description = "Movable node", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean movable;

    @Schema(description = "Replicable node", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean copyable;

    @Schema(description = "Importable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean importable;

    @Schema(description = "Exportable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean exportable;

    @Schema(description = "Deletable nodes", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean removable;

    @Schema(description = "Allow share nodes", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean sharable;

    @Schema(description = "The node can be set to allow others to save", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaveConfigurable;

    @Schema(description = "The node can be set to allow others to edit", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEditConfigurable;

    @Schema(description = "Can be created as a template", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean templateCreatable;

    @Schema(description = "New View", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewCreatable;

    @Schema(description = "Rename View", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRenamable;

    @Schema(description = "Delete View", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewRemovable;

    @Schema(description = "Move View", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewMovable;

    @Schema(description = "Export View", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewExportable;

    @Schema(description = "Filter Columns", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewFilterable;

    @Schema(description = "Sort Columns", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnSortable;

    @Schema(description = "Hide Columns", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnHideable;

    @Schema(description = "Edit Column Order", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldSortable;

    @Schema(description = "Groupe", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldGroupable;

    @Schema(description = "Edit Row Height", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowHighEditable;

    @Schema(description = "Edit Column Width", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnWidthEditable;

    @Schema(description = "Edit Column Statistics", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnCountEditable;

    @Schema(description = "Row sorting", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowSortable;

    @Schema(description = "New Field", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldCreatable;

    @Schema(description = "Rename Field", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRenamable;

    @Schema(description = "Edit Field Properties", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPropertyEditable;

    @Schema(description = "Delete Field", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldRemovable;

    @Schema(description = "New Row", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowCreatable;

    @Schema(description = "Delete Row", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowRemovable;

    @Schema(description = "Archive Row", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowArchivable;

    @Schema(description = "Unarchive Row", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rowUnarchivable;

    @Schema(description = "Edit Cell", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean cellEditable;

    @Schema(description = "Whether column permissions can be managed", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean fieldPermissionManageable;

    @Schema(description = "Edit View Layout", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewLayoutEditable;

    @Schema(description = "Edit View Style", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewStyleEditable;

    @Schema(description = "Edit View Key Fields", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewKeyFieldEditable;

    @Schema(description = "Edit View Color Options", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewColorOptionEditable;

    @Schema(description = "View lock can be managed", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewLockManageable;

    @Schema(description = "View can be saved manually for management", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewManualSaveManageable;

    @Schema(description = "View Options Save Editable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean viewOptionSaveEditable;

    @Schema(description = "Datasheet field permission information", type = "java.util.Map")
    private Map<String, FieldPermissionInfo> fieldPermissionMap;

    @Schema(description = "sharer is deleted", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;
}
