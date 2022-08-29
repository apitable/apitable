package com.vikadata.social.feishu;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.feishu.event.app.AppTicketEvent;

/**
 * APP Tick 推送事件处理
 * 默认由飞书内部组件完成处理转换
 *
 * @author Shawn Deng
 * @date 2020-11-24 19:06:04
 */
@Slf4j
public class AppTicketEventCallbackHandler implements FeishuEventCallbackHandler<AppTicketEvent> {

    private final AppTicketStorage appTicketStorage;

    public AppTicketEventCallbackHandler(AppTicketStorage appTicketStorage) {
        this.appTicketStorage = appTicketStorage;
    }

    @Override
    public Object doHandle(AppTicketEvent event) {
        // 开放平台会每隔1小时推送一次 app_ticket,有效期取1小时，
        // 当然如果遇到ticket失效，需要重新触发ticket发送事件
        log.info("Event [App Ticket] Received, new Ticket: [{}]. Doing save...", event.getAppTicket());
        appTicketStorage.updateTicket(event.getAppTicket(), 24 * 60 * 60);
        return null;
    }
}
