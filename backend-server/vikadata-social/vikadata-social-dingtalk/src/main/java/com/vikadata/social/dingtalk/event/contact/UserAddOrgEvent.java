package com.vikadata.social.dingtalk.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * 通讯录用户增加
 *
 * @author Zoe Zheng
 * @date 2021-05-13 13:57:35
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_ADD_ORG)
public class UserAddOrgEvent extends BaseContactUserEvent {
    /**
     * 操作人的userId
     */
    @JsonProperty(value = "OptStaffId")
    private String optStaffId;

}
