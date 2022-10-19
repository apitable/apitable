package com.vikadata.api.util.billing.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 订阅功能点
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/2 18:26
 */
@Getter
@AllArgsConstructor
public enum BillingFunctionEnum {

    /**
     * API用量限制
     */
    API_CALL("api_call"),

    /**
     * 容量
     */
    CAPACITY("storage_capacity"),

    /**
     * 成员总数
     */
    SEATS("seats"),

    /**
     * 管理员总数
     */
    ADMIN_NUM("space_admin"),

    /**
     * 单表行数
     */
    ROWS_PER_SHEET("rows_limit"),

    /**
     * 总行数
     */
    TOTAL_SHEET_ROWS("space_rows_limit"),

    /**
     * 回收站保存天数
     */
    TRASH("trash"),

    /**
     * 维格表总数
     */
    NODES("nodes"),

    /**
     * 日历视图
     */
    CALENDAR_VIEW("calendar_view"),

    /**
     * 相册视图
     */
    GALLERY_VIEW("gallery_view"),

    /**
     * 甘特视图
     */
    GANTT_VIEW("gantt_view"),

    /**
     * 看板视图
     */
    KANBAN_VIEW("kanban_view"),

    /**
     * 神奇表单
     */
    FORM_VIEW("form_view"),

    /**
     * 列权限
     */
    FIELD_PERMISSION("field_permission"),

    /**
     * 文件权限
     */
    NODE_PERMISSIONS("node_permissions"),

    /**
     * 历史记录（时光机）
     */
    TIME_MACHINE("time_machine"),

    /**
     * 钉钉集成
     */
    INTEGRATION_DINGTALK("integration_dingtalk"),

    /**
     * 飞书集成
     */
    INTEGRATION_FEISHU("integration_feishu"),

    /**
     * 企业微信集成
     */
    INTEGRATION_WECOM("integration_wecom"),

    /**
     * Office预览集成
     */
    INTEGRATION_OFFICE_PREVIEW("integration_office_preview"),

    /**
     * 彩虹标签
     */
    RAINBOW_LABEL("rainbow_label"),

    /**
     * 安全设置-显示全局水印
     */
    WATERMARK("watermark"),

    /**
     * 历史动态（行）
     */
    RECORD_ACTIVITY("record_activity"),

    /**
     * 安全设置-普通成员进行邀请操作
     */
    SECURITY_SETTING_INVITE_MEMBER("security_setting_invite_member"),

    /**
     * 安全设置-站外用户申请加入空间站
     */
    SECURITY_SETTING_APPLY_JOIN_SPACE("security_setting_apply_join_space"),

    /**
     * 安全设置-创建公开链接
     */
    SECURITY_SETTING_SHARE("security_setting_share"),

    /**
     * 安全设置-导出维格表和视图
     */
    SECURITY_SETTING_EXPORT("security_setting_export"),

    /**
     * 安全设置-只读用户下载附件
     */
    SECURITY_SETTING_DOWNLOAD_FILE("security_setting_download_file"),

    /**
     * 安全设置-只读用户将数据复制到站外
     */
    SECURITY_SETTING_COPY_CELL_DATA("security_setting_copy_cell_data"),

    /**
     * 安全设置-显示成员手机号
     */
    SECURITY_SETTING_MOBILE("security_setting_mobile"),

    /**
     * 审计日志
     */
    AUDIT_QUERY("audit_query"),

    /**
     * 安全设置-通讯录隐藏
     */
    SECURITY_SETTING_ADDRESS_LIST_ISOLATION("security_setting_address_list_isolation"),

    /**
     * 安全设置-禁止成员在根目录增删文件
     */
    SECURITY_SETTING_CATALOG_MANAGEMENT("security_setting_catalog_management"),

    /**
     * 镜像总数
     */
    MIRRORS("mirrors")
    ;

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
