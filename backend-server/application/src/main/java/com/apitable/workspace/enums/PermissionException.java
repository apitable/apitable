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

package com.apitable.workspace.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Permission Exception.
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum PermissionException implements BaseException {

    NODE_NOT_EXIST(600, "node does not exist"),

    NODE_ACCESS_DENIED(601, "unable to access node"),

    NODE_OPERATION_DENIED(602, "Unable to operate node"),

    SET_MAIN_ADMIN_FAIL(603, "Failed to set main admin"),

    TRANSFER_SELF(603, "Primary admin privileges cannot be transferred by themselves"),

    CAN_OP_MAIN_ADMIN(604, "Cannot select admin admin"),

    MEMBER_NOT_IN_SPACE(604, "The member is not in the current space"),

    OP_MEMBER_IS_SUB_ADMIN(604, "Select member is already a sub-admin"),

    CREATE_SUB_ADMIN_ERROR(606, "Failed to create sub-admin role"),

    UPDATE_ROLE_ERROR(607, "Failed to update admin"),

    DELETE_ROLE_ERROR(608, "Failed to delete admin"),

    ROLE_NOT_EXIST(609, "admin does not exist"),

    ORG_UNIT_NOT_EXIST(611,
        "The member or group you selected has been removed, please select again"),

    ADD_NODE_ROLE_ERROR(613, "Failed to add node role"),

    UPDATE_NODE_ROLE_ERROR(615, "Failed to modify node role"),

    DELETE_NODE_ROLE_ERROR(616, "Failed to delete node role"),

    NODE_ROLE_HAS_DISABLE_EXTEND(619, "Node permission is already specified mode"),

    INDEX_FIELD_NOT_ALLOW_SET(620, "The first column does not allow setting permissions"),

    FIELD_PERMISSION_HAS_ENABLE(621, "field permission is enabled"),

    FIELD_PERMISSION_NOT_OPEN(622, "The field permission is not enabled, the operation failed"),

    FIELD_ROLE_NOT_EXIST(623, "Field permission role does not exist"),

    UPDATE_FIELD_ROLE_SETTING(626, "Change field permission configuration"),

    ILLEGAL_CHANGE_FIELD_ROLE(627, "No permission to modify field permission"),

    ROOT_NODE_OP_DENIED(628,
        "The space admin has restricted adding and deleting files to the root directory, so you can't do this"),

    ONLY_MAIN_ADMIN_OPERATE(629, "only the main administrator can operate"),

    NOT_PERMISSION_ACCESS(630, "not permission access resource");

    private final Integer code;

    private final String message;
}
