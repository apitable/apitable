package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Obtain the suite access token for third-party enterprise applications
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteAccessTokenRequest {

    /**
     * Suite Key for third-party applications.
     * It can be obtained from the application details page in the developer background.
     */
    private String suiteKey;

    /**
     * The suite Ticket pushed by DingTalk can be filled in for customized applications,
     * and the suite ticket pushed to the application by third-party enterprise applications using the DingTalk open platform
     */
    private String suiteTicket;

    /**
     * The suite Secret of a third-party application can be obtained from the application details page in the developer's backend.
     */
    private String suiteSecret;
}
