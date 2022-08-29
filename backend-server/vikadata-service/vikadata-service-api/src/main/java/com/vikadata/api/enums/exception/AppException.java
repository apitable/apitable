package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 *
 * @author Shawn Deng
 * @date 2022-01-17 15:33:08
 */
@Getter
@AllArgsConstructor
public enum AppException implements BaseException {

    APP_NOT_EXIST(1301, "应用不存在"),

    APP_EXIST(1302, "应用已存在"),

    APP_INSTANCE_NOT_EXIST(1303, "应用实例不存在"),

    NOT_LARK_APP_TYPE(1304, "不是飞书应用类型"),

    APP_NOT_OPEN(1305, "应用未开启"),

    APP_KEY_EXIST(1306, "应用实例配置已存在");

    private final Integer code;

    private final String message;
}
