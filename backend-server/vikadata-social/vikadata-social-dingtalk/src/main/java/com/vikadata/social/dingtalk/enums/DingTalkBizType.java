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
public enum DingTalkBizType {
    /**
     * 套件票据suiteTicket最新状态
     */
    SUITE_TICKET_EVENT(2),

    /**
     * 业授权应用的最新状态
     */
    ORG_SUITE_AUTH(4),
    /**
     * 企业微应用的最新状态
     */
    ORG_MICRO_APP_RESTORE(7),
    /**
     *
     * 企业员工的最新状态
     */
    ORG_USER_RESTORE(13),
    /**
     * 企业部门的最新状态
     */
    ORG_DEPT_RESTORE(14),
    /**
     * 企业的最新状态
     */
    ORG_CREATE(16),
    /**
     * 应用内购订单
     */
    MARKET_ORDER(17),
    /**
     * 数据为订单到期或者退款导致的服务关闭数据
     */
    SUBSCRIPTION_CLOSE(37);

    private final Integer value;

    public Integer getValue() {
        return value;
    }

    public static DingTalkBizType toEnum(Integer value) {
        for (DingTalkBizType item : DingTalkBizType.values()) {
            if (item.value.equals(value)) {
                return item;
            }
        }
        return null;
    }

    public static boolean hasValue(Integer value) {
        for (DingTalkBizType item : DingTalkBizType.values()) {
            if (item.value.equals(value)) {
                return true;
            }
        }
        return false;
    }

}
