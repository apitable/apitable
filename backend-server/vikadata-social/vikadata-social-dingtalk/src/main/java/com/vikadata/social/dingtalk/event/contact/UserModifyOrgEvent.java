package com.vikadata.social.dingtalk.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Contacts User Change
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_MODIFY_ORG)
public class UserModifyOrgEvent extends BaseContactUserEvent {

    /**
     * Operator's user ID
     */
    @JsonProperty(value = "OptStaffId")
    private String optStaffId;
}
