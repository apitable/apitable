package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * billing exception
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum BillingException implements BaseException {

    ACCOUNT_BUNDLE_ERROR(901, "account subscription exception"),

    PLAN_FEATURE_NOT_SUPPORT(901, "subscription feature not supported"),

    PLAN_FEATURE_OVER_LIMIT(901, "subscription feature exceeds limit"),

    ACCOUNT_CREDIT_ALTER_FREQUENTLY(901, "Account points are operated too frequently, please try again later");

    private final Integer code;

    private final String message;
}
