package com.vikadata.social.dingtalk.enums;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * DingTalk subscribes to events
 */
@Getter
@AllArgsConstructor
public enum DingTalkEventTag {
    /**
     * Customize default values.
     */
    DEFAULT("default"),

    /**
     * Address book users increased.
     */
    USER_ADD_ORG("user_add_org"),

    /**
     * Contacts User Change
     */
    USER_MODIFY_ORG("user_modify_org"),

    /**
     * Contacts user leaves
     */
    USER_LEAVE_ORG("user_leave_org"),

    /**
     * User activation after joining the enterprise
     */
    USER_ACTIVATE_ORG("user_active_org"),

    /**
     * Contacts user is set as administrator
     */
    ORG_ADMIN_ADD("org_admin_add"),

    /**
     * Contacts user is canceled as administrator
     */
    ORG_ADMIN_REMOVE("org_admin_remove"),

    /**
     * enterprise department creation
     */
    ORG_DEPT_CREATE("org_dept_create"),

    /**
     * Corporate sector revisions.
     */
    ORG_DEPT_MODIFY("org_dept_modify"),

    /**
     * The contacts department is deleted.
     */
    ORG_DEPT_REMOVE("org_dept_remove"),

    /**
     * The business was dissolved.
     */
    ORG_REMOVE("org_remove"),

    ORG_CHANGE("org_change"),

    LABEL_USER_CHANGE("label_user_change"),

    LABEL_CONF_ADD("label_conf_add"),

    LABEL_CONF_DEL("label_conf_del"),

    LABEL_CONF_MODIFY("label_conf_modify"),

    CHECK_URL("check_url"),

    /**
     * Verify the validity of the callback address
     */
    CHECK_CREATE_SUITE_URL("check_create_url"),

    /**
     * Verify the validity of the updated callback address
     */
    CHECK_UPDATE_SUITE_URL("check_update_suite_url"),

    /**
     * High-priority data, activated apps, etc.
     */
    SYNC_HTTP_PUSH_HIGH("SYNC_HTTP_PUSH_HIGH"),

    /**
     * Normal priority data, such as address book changes
     */
    SYNC_HTTP_PUSH_MEDIUM("SYNC_HTTP_PUSH_MEDIUM");

    private final String value;

    public static DingTalkEventTag toEnum(String value) {
        for (DingTalkEventTag enums : DingTalkEventTag.values()) {
            if (enums.value.equals(value)) {
                return enums;
            }
        }
        return null;
    }

    /**
     * Get basic events
     *
     * @return List<DingTalkEvent>
     */
    public static List<String> baseEvent() {
        return Arrays.asList(USER_ADD_ORG.getValue(), USER_MODIFY_ORG.getValue(), USER_LEAVE_ORG.getValue(),
                USER_ACTIVATE_ORG.getValue(), ORG_ADMIN_ADD.getValue(), ORG_ADMIN_REMOVE.getValue(),
                ORG_DEPT_CREATE.getValue(), ORG_DEPT_MODIFY.getValue(), ORG_DEPT_REMOVE.getValue(),
                ORG_REMOVE.getValue());
    }

    public static Boolean isSyncHttpEvent(DingTalkEventTag tag) {
        return tag.equals(SYNC_HTTP_PUSH_HIGH) || tag.equals(SYNC_HTTP_PUSH_MEDIUM);
    }

    public static Boolean shouldHandleSyncHttpEvent(DingTalkEventTag tag) {
        return !tag.equals(CHECK_URL) && !tag.equals(CHECK_UPDATE_SUITE_URL) && !tag.equals(CHECK_CREATE_SUITE_URL);
    }

    public String getValue() {
        return value;
    }
}
