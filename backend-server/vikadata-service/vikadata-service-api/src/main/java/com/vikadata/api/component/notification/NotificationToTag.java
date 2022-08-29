package com.vikadata.api.component.notification;

import lombok.Getter;

/**
 * <p>
 * 通知to用户的标识
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/25 5:36 下午
 */
@Getter
public enum NotificationToTag {
    /**
     * 发给指定成员
     */
    MEMBERS("members"),
    /**
     * 空间内所有成员
     */
    ALL_MEMBERS("all_members"),
    /**
     * 空间管理员
     */
    SPACE_ADMINS("space_admins"),
    /**
     * 空间成员管理权限的管理员
     */
    SPACE_MEMBER_ADMINS("space_member_admins"),
    /**
     * 所有用户
     */
    ALL_USERS("all_users"),
    /**
     * 发给指定用户
     */
    USERS("users"),
    /**
     * 发给自己
     */
    MYSELF("myself"),
    /**
     * 发给主管理员
     */
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
