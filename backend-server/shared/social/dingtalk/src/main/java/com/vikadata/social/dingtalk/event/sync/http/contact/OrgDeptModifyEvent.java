package com.vikadata.social.dingtalk.event.sync.http.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_MEDIUM, action = DingTalkSyncAction.ORG_DEPT_MODIFY)
public class OrgDeptModifyEvent extends BaseOrgDeptContactEvent {
}
