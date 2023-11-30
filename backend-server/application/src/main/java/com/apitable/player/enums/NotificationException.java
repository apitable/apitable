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

package com.apitable.player.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * notification exception.
 * status code range（1201-1299）
 * </p>
 *
 * @author zoe zheng
 */
@Getter
@AllArgsConstructor
public enum NotificationException implements BaseException {

    USER_EMPTY_ERROR(1201, "user does not exist"),

    MEMBER_EMPTY_ERROR(1202, "member does not exist"),

    TMPL_TO_TAG_ERROR(1203, "template sending tag error"),

    MEMBER_MENTIONED_ERROR(1204, "member mention error");

    private final Integer code;

    private final String message;
}
