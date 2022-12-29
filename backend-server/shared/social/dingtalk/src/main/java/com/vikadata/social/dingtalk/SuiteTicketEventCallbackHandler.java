package com.vikadata.social.dingtalk;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.dingtalk.event.sync.http.SuiteTicketEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

@Slf4j
public class SuiteTicketEventCallbackHandler implements DingTalkEventCallbackHandler<SuiteTicketEvent> {

    private final HashMap<String, AppTicketStorage> suiteTicketStorage;

    public SuiteTicketEventCallbackHandler(HashMap<String, AppTicketStorage> appTicketStorage) {
        suiteTicketStorage = appTicketStorage;
    }

    /**
     * handler
     *
     * @param suiteId DingTalk ISV application suite Id
     * @param event DingTalk event
     * @return process result
     */
    @Override
    public Object doHandle(String suiteId, SuiteTicketEvent event) {
        // The open platform will push a suite_ticket every 5 hours, and the validity period is 5.5 hours.
        // Of course, if the ticket fails, you need to re-trigger the ticket sending event
        log.info("Event Suite Ticket Received, [{}] new Suite Ticket: [{}]. Doing Handle...", suiteId, event.getSuiteTicket());
        suiteTicketStorage.get(suiteId).updateTicket(event.getSuiteTicket(), 5 * 60 * 60 + 1800);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
