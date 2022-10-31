package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Types of Results for Image Machine Review
 */
@Getter
@AllArgsConstructor
public enum DingTalkAppType {

    /**
     * mobile application
     */
    MOBILE_APP("mobile-app"),

    /**
     * h5 application
     */
    H5_APP("h5-app"),

    /**
     * Customized service app
     */
    AGENT_APP("agent-app");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
