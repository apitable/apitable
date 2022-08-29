package com.vikadata.api.component.sentry;

import io.sentry.EventProcessor;
import io.sentry.SentryEvent;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author Shawn Deng
 * @date 2021-07-13 12:03:24
 */
@Slf4j
public class SentryEventProcessor implements EventProcessor {

    @Override
    public SentryEvent process(SentryEvent event, Object hint) {
        log.info("Sentry 事件处理");
        return event;
    }
}
