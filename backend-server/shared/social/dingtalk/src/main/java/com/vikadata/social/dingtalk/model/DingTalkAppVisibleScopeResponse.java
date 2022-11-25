package com.vikadata.social.dingtalk.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * asynchronously send job notifications response
 */
@Setter
@Getter
@ToString
public class DingTalkAppVisibleScopeResponse extends BaseResponse {
    /**
     * App visible list of users
     */
    @JsonProperty(value = "userVisibleScopes")
    List<String> userVisibleScopes;

    /**
     * Whether it is only visible to administrators, true means that it is only visible to administrators.
     */
    @JsonProperty(value = "isHidden")
    private Boolean isHidden;

    /**
     * List of departments visible to the app
     */
    @JsonProperty(value = "deptVisibleScopes")
    private List<Long> deptVisibleScopes;

}
