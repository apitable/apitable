package com.vikadata.social.feishu;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.feishu.event.app.AppTicketEvent;

/**
 * APP Tick push event handling
 * By default, Feishu internal components complete the processing and conversion
 */
@Slf4j
public class AppTicketEventCallbackHandler implements FeishuEventCallbackHandler<AppTicketEvent> {

    private final AppTicketStorage appTicketStorage;

    public AppTicketEventCallbackHandler(AppTicketStorage appTicketStorage) {
        this.appTicketStorage = appTicketStorage;
    }

    @Override
    public Object doHandle(AppTicketEvent event) {
        // The open platform will push app_ticket every 1 hour, and the validity period is 1 hour.
        // Of course, if the push ticket fails, you need to re-trigger the ticket sending event
        log.info("Event [App Ticket] Received, new Ticket: [{}]. Doing save...", event.getAppTicket());
        appTicketStorage.updateTicket(event.getAppTicket(), 24 * 60 * 60);
        return null;
    }
}
