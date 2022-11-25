package com.vikadata.social.feishu.event.app;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * app_ticket receive events
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_ticket")
public class AppTicketEvent extends BaseEvent {

    private String appTicket;
}
