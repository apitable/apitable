package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 订阅功能点异常提示
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/28 13:56
 */
@Getter
@AllArgsConstructor
public enum SubscribeFunctionException implements BaseException {

    /**
     * 表数量超出限制，请升级订阅方案
     */
    NODE_LIMIT(951, "表数量超出限制，请升级订阅方案"),

    /**
     * 容量超出限制，请升级订阅方案
     */
    CAPACITY_LIMIT(951, "容量超出限制，请升级订阅方案"),

    /**
     * 行数超出限制，请升级订阅方案
     */
    ROW_LIMIT(951, "行数超出限制，请升级订阅方案"),

    /**
     * 管理员数量超出限制，请升级订阅方案
     */
    ADMIN_LIMIT(951, "管理员数量超出限制，请升级订阅方案"),

    /**
     * 成员数量超出限制，请升级订阅方案
     */
    MEMBER_LIMIT(951, "成员数量超出限制，请升级订阅方案"),

    /**
     * 审计可查询天数超出限制，请升级订阅方案
     */
    AUDIT_LIMIT(951, "审计可查询天数超出限制，请升级订阅方案"),

    ;

    private final Integer code;

    private final String message;
}
