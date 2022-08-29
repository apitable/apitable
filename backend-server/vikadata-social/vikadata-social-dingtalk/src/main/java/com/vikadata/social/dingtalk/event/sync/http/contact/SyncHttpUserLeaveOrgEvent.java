package com.vikadata.social.dingtalk.event.sync.http.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;
import com.vikadata.social.dingtalk.event.sync.http.BaseSyncHttpEvent;

/**
 * <p> 
 * 事件列表 -- 企业删除员工
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_MEDIUM, action = DingTalkSyncAction.USER_LEAVE_ORG)
public class SyncHttpUserLeaveOrgEvent extends BaseSyncHttpEvent {
    // 删除员工userid从biz_id中获取
}
