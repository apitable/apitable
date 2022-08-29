package com.vikadata.social.dingtalk.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 事件订阅 基础属性
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 1:56 下午
 */
@Setter
@Getter
public class BaseEvent {

    @JsonProperty(value = "EventType")
    private String eventType;
}
