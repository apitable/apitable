package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Activate the app
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteActiveSuiteRequest {

    /**
     * Suite Key for third-party applications. It can be obtained from the application details page in the developer background.
     */
    private String suiteKey;

    /**
     * The Corp Id of the authorized company. The Corp Id pushed in the HTTP callback event.
     */
    private String authCorpid;

    /**
     * The permanent authorization code of the authorized enterprise.
     */
    private String permanentCode;
}
