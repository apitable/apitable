package com.vikadata.social.dingtalk.event.sync.http;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class BaseOrgMicroAppEvent extends BaseSyncHttpEvent {
    @JsonProperty("agentId")
    private Long agentId;
}
