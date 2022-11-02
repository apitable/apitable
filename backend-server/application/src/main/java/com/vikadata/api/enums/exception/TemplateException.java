package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * Template Exception
 * status code range（430-439）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TemplateException implements BaseException {

    NUMBER_LIMIT(430, "The maximum number of templates has been reached"),

    SUB_NODE_PERMISSION_INSUFFICIENT(430, "There are nodes with insufficient permissions under the folder"),

    FIELD_PERMISSION_INSUFFICIENT(430, "There is a wig table with insufficient field permissions"),

    SINGLE_FORM_CREATE_FAIL(430, "Collection forms do not allow separate templates to be saved"),

    SINGLE_DASHBOARD_CREATE_FAIL(430, "Dashboard does not allow templates to be saved individually"),

    SINGLE_MIRROR_CREATE_FAIL(430, "Mirroring does not allow templates to be saved separately"),

    FOLDER_NODE_LINK_FOREIGN_NODE(430, "The {FOREIGN FIELD NAMES} column in the '{NODE NAME}' table in the current folder is associated with a table outside the folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_FORM_LINK_FOREIGN_NODE(430, "The table attached to the form '{NODE NAME}' in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_DASHBOARD_LINK_FOREIGN_NODE(430, "The table referenced by the '{FOREIGN WIDGET NAME}' applet in the '{NODE NAME}' dashboard in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    FOLDER_MIRROR_LINK_FOREIGN_NODE(430, "The original table connected to the '{NODE NAME}' image in the current folder is not in the current folder. If the folder is related to the outside of the folder, it will not be able to save as a template"),

    NODE_LINK_FOREIGN_NODE(430, "The {FOREIGN FIELD NAMES} column in the current table is related to another table. In this case, it will not be possible to save as a template"),

    TEMPLATE_INFO_ERROR(431, "Template information error");

    private final Integer code;

    private final String message;
}
