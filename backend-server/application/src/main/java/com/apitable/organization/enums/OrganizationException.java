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

package com.apitable.organization.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Organization Exception.
 * status code range（501-599）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum OrganizationException implements BaseException {

    CREATE_TEAM_ERROR(501, "failed to create department"),

    UPDATE_TEAM_ERROR(502, "failed to modify department"),

    UPDATE_TEAM_NAME_ERROR(502, "failed to modify department name"),

    UPDATE_TEAM_LEVEL_ERROR(502,
        "Failed to adjust the department level, can not be adjusted to its own sub-department"),

    DELETE_TEAM_ERROR(503, "Failed to delete department"),

    TEAM_HAS_SUB(504,
        "There are sub-departments under this department, you need to delete the sub-departments under the department first"),

    TEAM_HAS_MEMBER(505,
        "You need to delete the members under the department first, and then delete the department"),

    GET_TEAM_ERROR(506, "Department does not exist, please try again"),

    DELETE_ROOT_ERROR(507, "Deletion of root department is not allowed"),

    NOT_EXIST_MEMBER(508, "Sorry, the member does not exist"),

    UPDATE_MEMBER_ERROR(509, "Failed to edit member"),

    CREATE_MEMBER_ERROR(510, "Failed to add member"),

    UPDATE_MEMBER_TEAM_ERROR(511, "Failed to adjust member's department"),

    DELETE_SPACE_ADMIN_ERROR(512, "Not allowed to delete primary admin"),

    DELETE_ACTION_ERROR(512, "delete operation type error"),

    DELETE_MEMBER_PARAM_ERROR(512, "delete member parameter error"),

    DELETE_MEMBER_ERROR(512, "Failed to delete member"),

    INVITE_EXPIRE(517, "The current invite link has expired"),

    INVITE_URL_ERROR(517, "illegal invitation link"),

    INVITE_EMAIL_NOT_FOUND(518,
        "This email has not been invited before, you cannot send another invitation"),

    INVITE_EMAIL_HAS_ACTIVE(518, "This email has been activated, please do not send it again"),

    INVITE_EMAIL_NOT_MATCH(518, "Invited email does not match"),

    INVITE_EMAIL_NOT_EXIT(518, "Invited email does not exist"),

    INVITE_EMAIL_HAS_LINK(518,
        "The invited mailbox has been bound to another user, please do not bind it repeatedly"),

    INVITE_TOO_OFTEN(518, "Frequent operations, please try again later"),

    EXCEL_BEYOND_MAX_ROW(519,
        "Upload a maximum of 200 member information at one time, please split it into multiple files and re-upload"),

    EXCEL_CAN_READ_ERROR(519, "The file cannot be read, please check the file and upload it again"),

    DUPLICATION_ROLE_NAME(523, "The role name already exists"),

    CREATE_ROLE_ERROR(524, "Failed to create role"),

    UPDATE_ROLE_NAME_ERROR(525, "Failed to modify role name"),

    NOT_EXIST_ROLE(526, "The role does not exist"),

    ADD_ROLE_MEMBER_ERROR(527, "Failed to add member"),

    ROLE_EXIST_ROLE_MEMBER(528, "There are members in this role"),

    SPACE_EXIST_ROLES(529, "The character already exists on the space station"),

    ILLEGAL_MEMBER_PERMISSION(530, "Illegal member permission"),

    ILLEGAL_TEAM_PERMISSION(531, "Illegal team permission"),

    ILLEGAL_ROLE_PERMISSION(532, "Illegal role permission"),

    DUPLICATION_TEAM_NAME(533, "The team name already exists"),

    GET_PARENT_TEAM_ERROR(534, "Parent department does not exist, please try again"),

    ILLEGAL_UNIT_ID(535, "Illegal unit id");



    private final Integer code;

    private final String message;
}
