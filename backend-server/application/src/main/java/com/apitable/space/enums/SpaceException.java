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

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Space ExceptionEnum.
 * status code range（400-409）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpaceException implements BaseException {

    CREATE_SPACE_ERROR(401, "Failed to create space"),

    SPACE_QUIT_FAILURE(402,
        "The main administrator cannot leave the space, please transfer permissions first or delete the space directly"),

    NOT_IN_SPACE(403, "Sorry, you have been removed from this space, operation is not allowed"),

    SPACE_NOT_EXIST(404, "space does not exist"),

    NUMBER_LIMIT(405, "The number of spaces has reached the limit"),

    USER_ADMIN_SPACE_LIMIT(405,
        "This user-manageable space station has exceeded the limit, only silver-class space stations can be handed over"),

    NOT_DELETED(408,
        "The space station has not entered the deletion countdown and cannot be deleted directly"),

    DELETE_SPACE_ERROR(408, "failed to delete space"),

    UPDATE_SPACE_INFO_FAIL(409, "Failed to update space station"),

    NOT_SPACE_MAIN_ADMIN(410, "Only space administrators can operate"),

    NO_ALLOW_OPERATE(411, "Operation not allowed"),

    NOT_SPACE_ADMIN(412, "Only space administrators can operate"),

    SPACE_ALREADY_CERTIFIED(413,
        "The space has been certified, please do not repeat the operation");

    private final Integer code;

    private final String message;
}
