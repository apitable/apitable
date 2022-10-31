package com.vikadata.social.dingtalk.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Increase in address book users
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_ADD_ORG)
public class UserAddOrgEvent extends BaseContactUserEvent {
    /**
     * Operator's user ID
     */
    @JsonProperty(value = "OptStaffId")
    private String optStaffId;

}
