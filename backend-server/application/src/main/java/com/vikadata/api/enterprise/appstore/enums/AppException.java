package com.vikadata.api.enterprise.appstore.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

@Getter
@AllArgsConstructor
public enum AppException implements BaseException {

    APP_NOT_EXIST(1301, "app does not exist"),

    APP_EXIST(1302, "app already exists"),

    APP_INSTANCE_NOT_EXIST(1303, "application instance does not exist"),

    NOT_LARK_APP_TYPE(1304, "not lark app type"),

    APP_NOT_OPEN(1305, "app is not open"),

    APP_KEY_EXIST(1306, "application instance configuration already exists");

    private final Integer code;

    private final String message;
}
