package com.vikadata.social.dingtalk.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 异步发送工作通知--response
 * </p>
 * @author zoe zheng
 * @date 2021/5/14 3:20 下午
 */
@Setter
@Getter
@ToString
public class DingTalkAppVisibleScopeResponse extends BaseResponse {
    /**
     * 是否仅限管理员可见，true代表仅限管理员可见。
     */
    @JsonProperty(value = "isHidden")
    private Boolean isHidden;

    /**
     * 应用可见的部门列表
     */
    @JsonProperty(value = "deptVisibleScopes")
    private List<Long> deptVisibleScopes;

    /**
     * 应用可见的用户列表
     */
    @JsonProperty(value = "userVisibleScopes")
    List<String> userVisibleScopes;

}
