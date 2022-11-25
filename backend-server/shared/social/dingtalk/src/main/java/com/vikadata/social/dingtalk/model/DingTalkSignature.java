package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Data required for signature calculation
 */
@Setter
@Getter
@ToString
public class DingTalkSignature {

    /**
     * The unique identification key of the application
     */
    private String accessKey;

    /**
     * The suite Ticket pushed by DingTalk can be filled in for customized applications,
     * and the suite ticket pushed to the application by third-party enterprise applications using the DingTalk open platform
     */
    private String suiteTicket;

    /**
     * app secret
     */
    private String appSecret;
}
