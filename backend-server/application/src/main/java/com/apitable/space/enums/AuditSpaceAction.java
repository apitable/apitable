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

package com.apitable.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * enumeration of space audit events.
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum AuditSpaceAction {

    CREATE_SPACE("create_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    RENAME_SPACE("rename_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    UPDATE_SPACE_LOGO("update_space_logo", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    DELETE_SPACE("delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    CANCEL_DELETE_SPACE("cancel_delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    ACTUAL_DELETE_SPACE("actual_delete_space", AuditSpaceCategory.SPACE_CHANGE_EVENT),

    CREATE_NODE("create_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    RENAME_NODE("rename_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    UPDATE_NODE_ICON("update_node_icon", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    UPDATE_NODE_COVER("update_node_cover", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    UPDATE_NODE_DESC("update_node_desc", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    IMPORT_NODE("import_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    COPY_NODE("copy_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    MOVE_NODE("move_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    SORT_NODE("sort_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    EXPORT_NODE("export_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    DELETE_NODE("delete_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    RECOVER_RUBBISH_NODE("recover_rubbish_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    DELETE_RUBBISH_NODE("delete_rubbish_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    QUOTE_TEMPLATE("quote_template", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    STORE_SHARE_NODE("store_share_node", AuditSpaceCategory.WORK_CATALOG_CHANGE_EVENT),

    ENABLE_NODE_SHARE("enable_node_share", AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    UPDATE_NODE_SHARE_SETTING("update_node_share_setting",
        AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    DISABLE_NODE_SHARE("disable_node_share", AuditSpaceCategory.WORK_CATALOG_SHARE_EVENT),

    ENABLE_NODE_ROLE("enable_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    DISABLE_NODE_ROLE("disable_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    ADD_NODE_ROLE("add_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    UPDATE_NODE_ROLE("update_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    DELETE_NODE_ROLE("delete_node_role", AuditSpaceCategory.WORK_CATALOG_PERMISSION_CHANGE_EVENT),

    CREATE_TEMPLATE("create_template", AuditSpaceCategory.SPACE_TEMPLATE_EVENT),

    DELETE_TEMPLATE("delete_template", AuditSpaceCategory.SPACE_TEMPLATE_EVENT),

    ;

    private final String action;

    private final AuditSpaceCategory category;
}
