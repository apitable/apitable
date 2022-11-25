package com.vikadata.social.dingtalk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Create apaas application
 */
@Setter
@Getter
@ToString
public class DingTalkCreateApaasAppResponse extends BaseResponse {

    @JsonProperty("agentId")
    private String agentId;

    @JsonProperty("bizAppId")
    private String bizAppId;
}
