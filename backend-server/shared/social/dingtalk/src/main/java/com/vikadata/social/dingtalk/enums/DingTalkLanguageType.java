package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Types of Results for Image Machine Review
 */
@Getter
@AllArgsConstructor
public enum DingTalkLanguageType {

    /**
     * chinese
     */
    ZH_CN("zh_CN"),

    /**
     * english
     */
    EN_US("en_US");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
