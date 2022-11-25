package com.vikadata.social.dingtalk.event.sync.http.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;
import com.vikadata.social.dingtalk.event.sync.http.BaseSyncHttpEvent;

/**
 * Incident List -- Enterprise Deletion of Employee
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_MEDIUM, action = DingTalkSyncAction.USER_LEAVE_ORG)
public class SyncHttpUserLeaveOrgEvent extends BaseSyncHttpEvent {
    // delete employee userid get from biz id
}
