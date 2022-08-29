package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * GrayReleaseException
 * 灰度发布功能状态码
 * 状态码范围（3005-3050）
 */
@Getter
@AllArgsConstructor
public enum GrayReleaseException implements BaseException {

    /**
     * 创建空间失败
     */
    FRONT_VERSION_ERROR(3005, "前端版本不匹配");

    private final Integer code;

    private final String message;
}
