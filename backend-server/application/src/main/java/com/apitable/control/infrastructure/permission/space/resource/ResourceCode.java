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

package com.apitable.control.infrastructure.permission.space.resource;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Space Resource code for widget permission validate.
 * </p>
 *
 * @author Pengap
 */
@Getter
@AllArgsConstructor
public enum ResourceCode {

    UPDATE_SPACE("UPDATE_SPACE"),

    DELETE_SPACE("DELETE_SPACE"),

    MANAGE_WORKBENCH_SETTING("MANAGE_WORKBENCH_SETTING"),

    ADD_MEMBER("ADD_MEMBER"),

    INVITE_MEMBER("INVITE_MEMBER"),

    READ_MEMBER("READ_MEMBER"),

    UPDATE_MEMBER("UPDATE_MEMBER"),

    DELETE_MEMBER("DELETE_MEMBER"),

    CREATE_TEAM("CREATE_TEAM"),

    READ_TEAM("READ_TEAM"),

    UPDATE_TEAM("UPDATE_TEAM"),

    DELETE_TEAM("DELETE_TEAM"),

    READ_MAIN_ADMIN("READ_MAIN_ADMIN"),

    UPDATE_MAIN_ADMIN("UPDATE_MAIN_ADMIN"),

    CREATE_SUB_ADMIN("CREATE_SUB_ADMIN"),

    READ_SUB_ADMIN("READ_SUB_ADMIN"),

    UPDATE_SUB_ADMIN("UPDATE_SUB_ADMIN"),

    DELETE_SUB_ADMIN("DELETE_SUB_ADMIN"),

    MANAGE_MEMBER_SETTING("MANAGE_MEMBER_SETTING"),

    CREATE_TEMPLATE("CREATE_TEMPLATE"),

    DELETE_TEMPLATE("DELETE_TEMPLATE"),

    MANAGE_SHARE_SETTING("MANAGE_SHARE_SETTING"),

    MANAGE_FILE_SETTING("MANAGE_FILE_SETTING"),

    MANAGE_ADVANCE_SETTING("MANAGE_ADVANCE_SETTING"),

    MANAGE_INTEGRATION_SETTING("MANAGE_INTEGRATION_SETTING"),

    UNPUBLISH_WIDGET("UNPUBLISH_WIDGET"),

    TRANSFER_WIDGET("TRANSFER_WIDGET"),

    CREATE_ROLE("CREATE_ROLE"),

    READ_ROLE("READ_ROLE"),

    UPDATE_ROLE("UPDATE_ROLE"),

    DELETE_ROLE("DELETE_ROLE"),

    ADD_ROLE_MEMBER("ADD_ROLE_MEMBER"),

    REMOVE_ROLE_MEMBER("REMOVE_ROLE_MEMBER");


    private final String code;
}
