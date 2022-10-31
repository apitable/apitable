package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * User activation after joining the enterprise
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_ACTIVATE_ORG)
public class UserActiveOrgEvent extends BaseContactUserEvent {
}
