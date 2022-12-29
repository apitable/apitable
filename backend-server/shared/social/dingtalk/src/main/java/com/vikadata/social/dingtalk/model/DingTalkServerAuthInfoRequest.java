package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Obtain authorized enterprise authorization informationEnterprise information
 */
@Getter
@Setter
@ToString
public class DingTalkServerAuthInfoRequest {
    /**
     * Optional, Suitekey for third-party applications
     */
    private String suiteKey;

    /**
     * Authorizer's Corp Id
     */
    private String authCorpid;
}
