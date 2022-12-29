package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Dingding Subscription Event--Data Format Type
 */
@Getter
@AllArgsConstructor
public enum DingTalkSyncAction {
    /**
     * Suite Ticket latest status
     */
    DEFAULT("default"),

    /**
     * Suite Ticket latest status
     */
    SUITE_TICKET("suite_ticket"),

    /**
     * Enterprise Licensing Suite
     */
    ORG_SUITE_AUTH("org_suite_auth"),

    /**
     * Enterprise change authorization scope
     */
    ORG_SUITE_CHANGE("org_suite_change"),

    /**
     * Indicates that the company is de-authorized
     */
    ORG_SUITE_RELIEVE("org_suite_relieve"),

    /**
     * Microapps enabled
     */
    ORG_MICRO_APP_RESTORE("org_micro_app_restore"),

    /**
     *
     * Micro app deactivation
     */
    ORG_MICRO_APP_STOP("org_micro_app_stop"),

    /**
     * The latest status of the corporate sector
     */
    ORG_MICRO_APP_REMOVE("org_micro_app_remove"),

    /**
     * Microapp Visibility Changes
     */
    ORG_MICRO_APP_SCOPE_UPDATE("org_micro_app_scope_update"),

    /**
     * Employee information after the company adds employee events
     */
    USER_ADD_ORG("user_add_org"),

    /**
     * Employee information after the company adds employee events
     */
    USER_MODIFY_ORG("user_modify_org"),

    /**
     * Employee information after the company adds employee events
     */
    USER_DEPT_CHANGE("user_dept_change"),

    /**
     * Employee information after the company modifies the role of the employee (including administrator change)
     */
    USER_ROLE_CHANGE("user_role_change"),

    /**
     * Activation information after the user joins the enterprise. When the active field is true, it means it has
     * been activated.
     */
    USER_ACTIVATE_ORG("user_active_org"),

    /**
     * Enterprise delete employee Delete employee userid from biz_id
     */
    USER_LEAVE_ORG("user_leave_org"),

    /**
     * Create a department
     */
    ORG_DEPT_CREATE("org_dept_create"),

    /**
     * Create a department
     */
    ORG_DEPT_MODIFY("org_dept_modify"),

    /**
     * Enterprise delete department Delete department id is obtained from biz_id
     */
    ORG_DEPT_REMOVE("org_dept_remove"),

    /**
     * Enterprise change
     */
    ORG_UPDATE("org_update"),

    /**
     * Enterprise change Delete the corpId of the enterprise and get it from biz_id
     */
    ORG_REMOVE("org_remove"),

    /**
     * order information
     */
    MARKET_ORDER("market_order"),
    
    /**
     * If syncAction is market_service_close, it means that the service is closed due to order expiration or user refund.
     * Note Only service shutdowns due to refunds are currently being pushed.
     */
    MARKET_SERVICE_CLOSE("market_service_close");

    private final String value;

    public static DingTalkSyncAction toEnum(String value) {
        for (DingTalkSyncAction item : DingTalkSyncAction.values()) {
            if (item.value.equals(value)) {
                return item;
            }
        }
        return null;
    }

    public String getValue() {
        return value;
    }
}
