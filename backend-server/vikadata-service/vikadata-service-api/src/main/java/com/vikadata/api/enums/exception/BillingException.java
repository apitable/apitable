package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 账单 异常
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/28 13:56
 */
@Getter
@AllArgsConstructor
public enum BillingException implements BaseException {

    /**
     * 创建账户失败
     */
    CREATE_ACCOUNT_ERROR(901, "创建账户失败"),

    /**
     * 查找账户失败
     */
    FIND_ACCOUNT_ERROR(901, "查找账户失败"),

    /**
     * 账户订阅异常
     */
    ACCOUNT_BUNDLE_ERROR(901, "账户订阅异常"),

    /**
     * 获取账户账单失败
     */
    ACCOUNT_INVOICE_ERROR(901, "获取账户账单失败"),

    /**
     * 获取订阅失败
     */
    GET_SUBSCRIPTION_ERROR(901, "获取订阅失败"),

    /**
     * 订阅功能不支持
     */
    PLAN_FEATURE_NOT_SUPPORT(901, "订阅功能不支持"),

    /**
     * 订阅功能超过限制
     */
    PLAN_FEATURE_OVER_LIMIT(901, "订阅功能超过限制"),

    /**
     * 账户积分明细错误，请联系管理员修复
     */
    ACCOUNT_CREDIT_ERROR(901, "账户积分明细错误，请联系管理员修复"),

    /**
     * 账户积分操作太频繁,请稍后重试
     */
    ACCOUNT_CREDIT_ALTER_FREQUENTLY(901, "账户积分操作太频繁,请稍后重试"),

    /**
     * 账户变更积分失败
     */
    ACCOUNT_CREDIT_ALTER_FAIL(901, "账户变更积分失败"),

    /**
     * 账户积分添加失败
     */
    INCREASE_ACCOUNT_CREDIT_FAIL(901, "账户积分添加失败"),

    /**
     * 账户积分扣减失败
     */
    REDUCE_ACCOUNT_CREDIT_FAIL(901, "账户积分扣减失败");

    private final Integer code;

    private final String message;
}
