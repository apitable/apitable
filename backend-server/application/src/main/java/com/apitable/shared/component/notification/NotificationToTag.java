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

package com.apitable.shared.component.notification;

import lombok.Getter;

/**
 * <p>
 * notification target object.
 * </p>
 *
 * @author zoe zheng
 */
@Getter
public enum NotificationToTag {

    MEMBERS("members"),

    ALL_MEMBERS("all_members"),

    SPACE_ADMINS("space_admins"),

    SPACE_MEMBER_ADMINS("space_member_admins"),

    ALL_USERS("all_users"),

    USERS("users"),

    MYSELF("myself"),

    SPACE_MAIN_ADMIN("space_main_admin");

    private String value;

    NotificationToTag(String value) {
        this.value = value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    /**
     * transform string to enum.
     *
     * @param value string
     * @return enum
     */
    public static NotificationToTag getValue(String value) {
        for (NotificationToTag enums : NotificationToTag.values()) {
            if (enums.value.equals(value)) {
                return enums;
            }
        }
        return null;
    }

    public static boolean toUserTag(NotificationToTag tag) {
        return tag.equals(USERS) || tag.equals(MYSELF);
    }

    public static boolean toAllUserTag(NotificationToTag tag) {
        return tag.equals(ALL_USERS);
    }

    public static boolean toMemberTag(NotificationToTag tag) {
        return tag.equals(MEMBERS) || tag.equals(ALL_MEMBERS) || tag.equals(SPACE_ADMINS)
            || tag.equals(SPACE_MEMBER_ADMINS) || tag.equals(SPACE_MAIN_ADMIN);
    }
}
