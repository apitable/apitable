package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Contacts Enterprise Department Creation
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.ORG_DEPT_CREATE)
public class OrgDeptCreateEvent extends BaseContactDeptEvent {

}
