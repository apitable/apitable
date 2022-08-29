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
public enum DingTalkAppType {

    /**
     * 移动接入应用
     */
    MOBILE_APP("mobile-app"),

    /**
     * 企业内部h5应用
     */
    H5_APP("h5-app"),

    /**
     * 定制服务app
     */
    AGENT_APP("agent-app");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
