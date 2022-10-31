package com.vikadata.social.dingtalk.event.contact;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * Basic Address Book Event Properties
 */
@Setter
@Getter
public class BaseContactUserEvent extends BaseEvent {
    @JsonProperty(value = "CorpId")
    private String corpId;

    @JsonProperty(value = "TimeStamp")
    private String timestamp;

    @JsonProperty(value = "UserId")
    private List<String> userId;
}
