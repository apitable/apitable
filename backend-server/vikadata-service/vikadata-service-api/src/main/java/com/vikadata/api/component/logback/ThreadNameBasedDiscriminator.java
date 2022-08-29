package com.vikadata.api.component.logback;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.sift.Discriminator;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-27 16:18:19
 */
public class ThreadNameBasedDiscriminator implements Discriminator<ILoggingEvent> {

    private static final String KEY = "threadName";

    private boolean started;

    @Override
    public String getDiscriminatingValue(ILoggingEvent iLoggingEvent) {
        return Thread.currentThread().getName();
    }

    @Override
    public String getKey() {
        return KEY;
    }

    public void start() {
        started = true;
    }

    public void stop() {
        started = false;
    }

    public boolean isStarted() {
        return started;
    }
}
