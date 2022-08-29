package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * MarketplaceException
 * 应用市场异常状态码
 * 状态码范围（1301-1399）
 *
 * @author Benson Cheung
 * @since 2021/04/06
 */
@Getter
@AllArgsConstructor
@Deprecated
public enum MarketplaceException implements BaseException {

    /**
     * 应用开启失败
     */
    APP_CREATE_ERROR(1301, "应用开启失败"),

    /**
     * 应用停用失败
     */
    APP_BLOCK_ERROR(1302, "应用停用失败"),

    /**
     * 应用不可重复开启
     */
    APP_REPETITION_ERROR(1303, "应用不可重复开启"),


    /**
     * 该空间站尚未开启此应用
     */
    APP_NOT_OPENED(256, "该空间站尚未开启此应用，无法预览，请重新尝试");


    private final Integer code;

    private final String message;
}
