package com.vikadata.social.dingtalk.event;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Contacts User Change
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.SYNC_HTTP_PUSH_HIGH)
public class SyncHttpPushHighEvent extends BaseEvent {
    @JsonProperty("bizData")
    private List<BaseSyncHttpBizData> bizData;
}
