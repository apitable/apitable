package com.vikadata.api.enums.exception;


import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 核心框架异常
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/9/4 16:55
 */
@Getter
@AllArgsConstructor
public enum CoreException implements BaseException {

    /**
     * 文件过大（超过配置上限）
     */
    EXCEED_MAX_UPLOAD_SIZE(9900, "文件过大");

    private final Integer code;

    private final String message;
}
