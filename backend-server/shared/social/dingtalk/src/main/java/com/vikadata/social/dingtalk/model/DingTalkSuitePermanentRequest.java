package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Obtain a permanent authorization code for an authorized enterprise
 */
@Setter
@Getter
@ToString
public class DingTalkSuitePermanentRequest {

    /**
     * The temporary authorization code obtained by the callback interface (tmp auth code).
     */
    private String tmpAuthCode;
}
