package com.vikadata.api.component.notification;

import lombok.Getter;

/**
 * <p>
 * notification target object
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

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

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
        return tag.equals(MEMBERS) || tag.equals(ALL_MEMBERS) || tag.equals(SPACE_ADMINS) || tag.equals(SPACE_MEMBER_ADMINS) || tag.equals(SPACE_MAIN_ADMIN);
    }
}
