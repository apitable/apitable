package com.vikadata.social.dingtalk.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Event Subscription Basic Properties
 */
@Setter
@Getter
public class BaseEvent {

    @JsonProperty(value = "EventType")
    private String eventType;
}
