package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Address Book Enterprise Department Modification
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.ORG_DEPT_MODIFY)
public class OrgDeptModifyEvent extends BaseContactDeptEvent {

}
