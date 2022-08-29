package com.vikadata.social.dingtalk.event.sync.http;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.BaseEvent;

import static com.vikadata.social.dingtalk.DingTalkServiceProvider.EVENT_CALLBACK_TYPE_KEY;
import static com.vikadata.social.dingtalk.DingTalkServiceProvider.EVENT_SYNC_ACTION_CORP_ID_KEY;
import static com.vikadata.social.dingtalk.DingTalkServiceProvider.EVENT_SYNC_ACTION_KEY;
import static com.vikadata.social.dingtalk.DingTalkServiceProvider.EVENT_SYNC_ACTION_SUITE_ID_KEY;

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
public class BaseSyncHttpEvent extends BaseEvent {
    /**
     * 后期加入的，没有意义
     */
    @JsonProperty(EVENT_CALLBACK_TYPE_KEY)
    private String eventType;

    @JsonProperty(EVENT_SYNC_ACTION_KEY)
    private String syncAction;

    @JsonProperty(EVENT_SYNC_ACTION_CORP_ID_KEY)
    private String corpId;

    @JsonProperty(EVENT_SYNC_ACTION_SUITE_ID_KEY)
    private String suiteId;
}
