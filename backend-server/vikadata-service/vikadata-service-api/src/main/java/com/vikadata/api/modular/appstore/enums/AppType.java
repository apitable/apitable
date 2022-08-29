package com.vikadata.api.modular.appstore.enums;

/**
 * 应用类型
 * @author Shawn Deng
 * @date 2022-01-14 18:43:20
 */
public enum AppType {

    LARK, LARK_STORE, DINGTALK, DINGTALK_STORE, WECOM, WECOM_STORE, OFFICE_PREVIEW;

    public static AppType of(String name) {
        AppType types = null;
        for (AppType value : AppType.values()) {
            if (value.name().equalsIgnoreCase(name)) {
                types = value;
            }
        }
        return types;
    }
}
