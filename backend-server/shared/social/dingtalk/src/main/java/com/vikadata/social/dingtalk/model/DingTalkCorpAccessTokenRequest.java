package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get app_access_token
 */
@Getter
@Setter
@ToString
public class DingTalkCorpAccessTokenRequest {
    /**
     * The Corp Id of the authorized company
     */
    private String authCorpid;
}
