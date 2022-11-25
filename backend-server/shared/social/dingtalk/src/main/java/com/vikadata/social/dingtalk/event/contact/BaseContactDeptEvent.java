package com.vikadata.social.dingtalk.event.contact;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * basic address book department event properties
 */
@Setter
@Getter
public class BaseContactDeptEvent extends BaseEvent {
    @JsonProperty(value = "CorpId")
    private String corpId;

    @JsonProperty(value = "TimeStamp")
    private String timestamp;

    @JsonProperty(value = "DeptId")
    private List<String> deptId;
}
