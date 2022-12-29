package com.vikadata.social.dingtalk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get app contact scope
 */
@Setter
@Getter
@ToString
public class DingTalkAppVisibleScopeRequest {
    /**
     * App ID
     */
    @JsonProperty(value = "agentId")
    private Long agentId;
}
