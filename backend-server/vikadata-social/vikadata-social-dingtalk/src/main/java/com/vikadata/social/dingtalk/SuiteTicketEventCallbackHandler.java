package com.vikadata.social.dingtalk;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.dingtalk.event.sync.http.SuiteTicketEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * APP Tick 推送事件处理
 * 默认由飞书内部组件完成处理转换
 *
 * @author Shawn Deng
 * @date 2020-11-24 19:06:04
 */
@Slf4j
public class SuiteTicketEventCallbackHandler implements DingTalkEventCallbackHandler<SuiteTicketEvent> {

    private final HashMap<String, AppTicketStorage> suiteTicketStorage;

    public SuiteTicketEventCallbackHandler(HashMap<String, AppTicketStorage> appTicketStorage) {
        suiteTicketStorage = appTicketStorage;
    }

    /**
     * 处理方法
     *
     * @param suiteId 钉钉ISV应用suiteId
     * @param event 钉钉事件
     * @return 处理结果
     */
    @Override
    public Object doHandle(String suiteId, SuiteTicketEvent event) {
        // 开放平台会每隔5小时推送一次 suite_ticket,有效期取5.5小时，
        // 当然如果遇到ticket失效，需要重新触发ticket发送事件
        log.info("Event Suite Ticket Received, [{}] new Suite Ticket: [{}]. Doing Handle...", suiteId, event.getSuiteTicket());
        suiteTicketStorage.get(suiteId).updateTicket(event.getSuiteTicket(), 5 * 60 * 60 + 1800);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
