package com.vikadata.social.dingtalk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取应用可见范围
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkAppVisibleScopeRequest {
    /**
     * 应用ID
     */
    @JsonProperty(value = "agentId")
    private Long agentId;
}
