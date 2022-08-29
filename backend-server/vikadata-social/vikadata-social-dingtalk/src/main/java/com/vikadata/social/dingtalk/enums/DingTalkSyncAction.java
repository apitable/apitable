package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 钉钉订阅事件--数据格式类型
 * </p>
 * @author zoe zheng
 * @date 2021/5/12 7:48 下午
 */
@Getter
@AllArgsConstructor
public enum DingTalkSyncAction {
    /**
     * 套件票据suiteTicket最新状态
     */
    DEFAULT("default"),
    /**
     * 套件票据suiteTicket最新状态
     */
    SUITE_TICKET("suite_ticket"),
    /**
     * 企业授权套件
     */
    ORG_SUITE_AUTH("org_suite_auth"),
    /**
     * 企业变更授权范围
     */
    ORG_SUITE_CHANGE("org_suite_change"),
    /**
     * 表示企业解除授权
     */
    ORG_SUITE_RELIEVE("org_suite_relieve"),
    /**
     * 微应用启用
     */
    ORG_MICRO_APP_RESTORE("org_micro_app_restore"),
    /**
     *
     * 微应用停用
     */
    ORG_MICRO_APP_STOP("org_micro_app_stop"),
    /**
     * 企业部门的最新状态
     */
    ORG_MICRO_APP_REMOVE("org_micro_app_remove"),
    /**
     * 微应用可见范围变更
     */
    ORG_MICRO_APP_SCOPE_UPDATE("org_micro_app_scope_update"),
    /**
     * 企业增加员工事件之后的员工信息
     */
    USER_ADD_ORG("user_add_org"),
    /**
     * 企业增加员工事件之后的员工信息
     */
    USER_MODIFY_ORG("user_modify_org"),
    /**
     * 企业增加员工事件之后的员工信息
     */
    USER_DEPT_CHANGE("user_dept_change"),
    /**
     * 企业修改员工所在角色(包括管理员变更)事件之后的员工信息
     */
    USER_ROLE_CHANGE("user_role_change"),
    /**
     * 用户加入企业后的激活信息，active字段为true时表示已激活
     */
    USER_ACTIVATE_ORG("user_active_org"),
    /**
     * 企业删除员工
     * 删除员工userid从biz_id中获取
     */
    USER_LEAVE_ORG("user_leave_org"),
    /**
     * 创建部门
     */
    ORG_DEPT_CREATE("org_dept_create"),
    /**
     * 创建部门
     */
    ORG_DEPT_MODIFY("org_dept_modify"),
    /**
     * 企业删除部门
     * 删除部门id从biz_id中获取
     */
    ORG_DEPT_REMOVE("org_dept_remove"),
    /**
     * 企业变更
     */
    ORG_UPDATE("org_update"),
    /**
     * 企业变更
     * 删除企业的corpId从biz_id中获取
     */
    ORG_REMOVE("org_remove"),
    /**
     * 订单信息
     */
    MARKET_ORDER("market_order"),
    /**
     * syncAction为market_service_close表示因订单到期或者用户退款等导致的服务关闭。
     * 注意 目前仅推送因退款导致的服务关闭。
     */
    MARKET_SERVICE_CLOSE("market_service_close");

    private final String value;

    public String getValue() {
        return value;
    }

    public static DingTalkSyncAction toEnum(String value) {
        for (DingTalkSyncAction item : DingTalkSyncAction.values()) {
            if (item.value.equals(value)) {
                return item;
            }
        }
        return null;
    }
}
