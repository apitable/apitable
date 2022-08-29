package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 图片机器审核的结果类型
 *
 * @author Benson Cheung
 * @since 2020/03/21
 */
@Getter
@AllArgsConstructor
public enum DingTalkLanguageType {

    /**
     * 中文
     */
    ZH_CN("zh_CN"),

    /**
     * 英文
     */
    EN_US("en_US");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
