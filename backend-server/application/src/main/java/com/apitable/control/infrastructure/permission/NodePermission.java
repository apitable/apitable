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

package com.apitable.control.infrastructure.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * node permission definition.
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum NodePermission implements PermissionDefinition {

    MANAGE_NODE("manageable", 0, 1L),

    EDIT_NODE("editable", 0, 1L << 1),

    READ_NODE("readable", 0, 1L << 2),

    CREATE_NODE("childCreatable", 0, 1L << 3),

    RENAME_NODE("renamable", 0, 1L << 4),

    EDIT_NODE_ICON("iconEditable", 0, 1L << 5),

    EDIT_NODE_DESC("descriptionEditable", 0, 1L << 6),

    MOVE_NODE("movable", 0, 1L << 7),

    COPY_NODE("copyable", 0, 1L << 8),

    IMPORT_NODE("importable", 0, 1L << 9),

    EXPORT_NODE("exportable", 0, 1L << 10),

    REMOVE_NODE("removable", 0, 1L << 11),

    /**
     * read node share info.
     */
    SHARE_NODE("sharable", 0, 1L << 12),

    /**
     * allow saved shared node.
     */
    SET_NODE_SHARE_ALLOW_SAVE("allowSaveConfigurable", 0, 1L << 13),

    /**
     * allow edited share node.
     */
    SET_NODE_SHARE_ALLOW_EDIT("allowEditConfigurable", 0, 1L << 14),

    /**
     * node configurable.
     */
    ASSIGN_NODE_ROLE("nodeAssignable", 0, 1L << 15),

    /**
     * create template.
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
     * whether to manage view lock.
     */
    MANAGE_VIEW_LOCK("viewLockManageable", 1, 1L << 26),

    /**
     * whether to manage view munual save operation.
     */
    MANAGE_VIEW_MANUAL_SAVE("viewManualSaveManageable", 1, 1L << 27),

    /**
     * whether to edit view option.
     */
    EDIT_VIEW_OPTION_SAVE("viewOptionSaveEditable", 1, 1L << 28),

    ARCHIVE_ROW("rowArchivable", 1, 1L << 29),

    UNARCHIVE_ROW("rowUnarchivable", 1, 1L << 30),
    ;

    /**
     * unique code.
     */
    private final String code;

    /**
     * permission group.
     */
    private final int group;

    /**
     * unique memory value.
     */
    private final long value;

}
