package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Contacts user leaves
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_LEAVE_ORG)
public class UserLeaveOrgEvent extends BaseContactUserEvent {
}
