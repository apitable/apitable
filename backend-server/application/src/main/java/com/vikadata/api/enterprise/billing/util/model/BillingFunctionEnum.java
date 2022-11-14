package com.vikadata.api.enterprise.billing.util.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Billing Function
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum BillingFunctionEnum {

    API_CALL("api_call"),

    CAPACITY("storage_capacity"),

    SEATS("seats"),

    ADMIN_NUM("space_admin"),

    ROWS_PER_SHEET("rows_limit"),

    TOTAL_SHEET_ROWS("space_rows_limit"),

    TRASH("trash"),

    NODES("nodes"),

    CALENDAR_VIEW("calendar_view"),

    GALLERY_VIEW("gallery_view"),

    GANTT_VIEW("gantt_view"),

    KANBAN_VIEW("kanban_view"),

    FORM_VIEW("form_view"),

    FIELD_PERMISSION("field_permission"),

    NODE_PERMISSIONS("node_permissions"),

    TIME_MACHINE("time_machine"),

    INTEGRATION_DINGTALK("integration_dingtalk"),

    INTEGRATION_FEISHU("integration_feishu"),

    INTEGRATION_WECOM("integration_wecom"),

    INTEGRATION_OFFICE_PREVIEW("integration_office_preview"),

    RAINBOW_LABEL("rainbow_label"),

    WATERMARK("watermark"),

    RECORD_ACTIVITY("record_activity"),

    SECURITY_SETTING_INVITE_MEMBER("security_setting_invite_member"),

    SECURITY_SETTING_APPLY_JOIN_SPACE("security_setting_apply_join_space"),

    SECURITY_SETTING_SHARE("security_setting_share"),

    SECURITY_SETTING_EXPORT("security_setting_export"),

    SECURITY_SETTING_DOWNLOAD_FILE("security_setting_download_file"),

    SECURITY_SETTING_COPY_CELL_DATA("security_setting_copy_cell_data"),

    SECURITY_SETTING_MOBILE("security_setting_mobile"),

    AUDIT_QUERY("audit_query"),

    SECURITY_SETTING_ADDRESS_LIST_ISOLATION("security_setting_address_list_isolation"),

    SECURITY_SETTING_CATALOG_MANAGEMENT("security_setting_catalog_management"),

    MIRRORS("mirrors");

    private final String code;

    public static BillingFunctionEnum of(String code) {
        for (BillingFunctionEnum e : BillingFunctionEnum.values()) {
            if (e.getCode().equals(code)) {
                return e;
            }
        }
        throw new NullPointerException("Can't Get Subscription Plan Function");
    }
}
