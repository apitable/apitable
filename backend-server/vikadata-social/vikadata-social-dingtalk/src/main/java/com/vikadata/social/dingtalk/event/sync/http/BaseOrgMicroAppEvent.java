package com.vikadata.social.dingtalk.event.sync.http;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 事件列表 -- 验证设置的回调地址有效性
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
 */
@Setter
@Getter
@ToString
public class BaseOrgMicroAppEvent extends BaseSyncHttpEvent {
    @JsonProperty("agentId")
    private Long agentId;
}
