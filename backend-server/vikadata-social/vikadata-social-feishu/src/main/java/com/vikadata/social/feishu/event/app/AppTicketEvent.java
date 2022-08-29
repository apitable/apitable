package com.vikadata.social.feishu.event.app;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * app_ticket 接收事件
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 22:46
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_ticket")
public class AppTicketEvent extends BaseEvent {

    private String appTicket;
}
