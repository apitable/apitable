package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Contacts user is set as administrator
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.ORG_ADMIN_ADD)
public class OrgAdminAddEvent extends BaseContactUserEvent {
}
