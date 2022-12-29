package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User Info
 */
@Setter
@Getter
@ToString
public class DingTalkUserCountRequest {
    /**
     * Whether to include the number of inactive Dingding
     */
    private Boolean onlyActive;
}
