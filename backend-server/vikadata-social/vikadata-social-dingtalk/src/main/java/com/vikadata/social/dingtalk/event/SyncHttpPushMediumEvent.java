package com.vikadata.social.dingtalk.event;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * 通讯录用户更改
 *
 * @author Zoe Zheng
 * @date 2021-05-13 13:57:35
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.SYNC_HTTP_PUSH_MEDIUM)
public class SyncHttpPushMediumEvent extends BaseEvent {
    @JsonProperty("bizData")
    private List<BaseSyncHttpBizData> bizData;
}
