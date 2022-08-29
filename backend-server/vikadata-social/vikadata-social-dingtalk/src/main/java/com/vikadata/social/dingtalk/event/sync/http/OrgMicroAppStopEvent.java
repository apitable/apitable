package com.vikadata.social.dingtalk.event.sync.http;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * <p> 
 * 事件列表 -- 验证设置的回调地址有效性
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_HIGH, action = DingTalkSyncAction.ORG_MICRO_APP_STOP)
public class OrgMicroAppStopEvent extends BaseOrgMicroAppEvent {
}
