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

package com.apitable.template.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Template Exception.
 * status code range（430-439）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TemplateException implements BaseException {

    NUMBER_LIMIT(430, "The maximum number of templates has been reached"),

    SUB_NODE_PERMISSION_INSUFFICIENT(430,
        "There are nodes with insufficient permissions under the folder"),

    FIELD_PERMISSION_INSUFFICIENT(430, "There is a wig table with insufficient field permissions"),

    SINGLE_FORM_CREATE_FAIL(430, "Collection forms do not allow separate templates to be saved"),

    SINGLE_DASHBOARD_CREATE_FAIL(430,
        "Dashboard does not allow templates to be saved individually"),

    SINGLE_MIRROR_CREATE_FAIL(430, "Mirroring does not allow templates to be saved separately"),

    FOLDER_NODE_LINK_FOREIGN_NODE(430,
        "The {FOREIGN FIELD NAMES} column in the '{NODE NAME}' table in the current folder is associated with a table outside the folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_FORM_LINK_FOREIGN_NODE(430,
        "The table attached to the form '{NODE NAME}' in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_DASHBOARD_LINK_FOREIGN_NODE(430,
        "The table referenced by the '{FOREIGN WIDGET NAME}' applet in the '{NODE NAME}' dashboard in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_AUTOMATION_LINK_FOREIGN_NODE(430,
        "The '{NODE_NAME}' table referenced by the '{AUTOMATION_NAME}' automation in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_MIRROR_LINK_FOREIGN_NODE(430,
        "The original table connected to the '{NODE NAME}' image in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    NODE_LINK_FOREIGN_NODE(430,
        "The {FOREIGN FIELD NAMES} column in the current table is related to another table. In this case, it will not be possible to save as a template"),

    TEMPLATE_INFO_ERROR(431, "Template information error"),

    TEMPLATE_CATEGORY_NOT_EXIST(432, "Template category does not exist"),

    TEMPLATE_CATEGORY_HAVE_BEEN_EXIST(432, "This template category have been existed."),

    ;

    private final Integer code;

    private final String message;
}
