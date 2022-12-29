package com.vikadata.social.dingtalk.event.sync.http;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_HIGH, action = DingTalkSyncAction.SUITE_TICKET)
public class SuiteTicketEvent extends BaseSyncHttpEvent {
    @JsonProperty("suiteTicket")
    private String suiteTicket;
}
