package com.vikadata.api.shared.listener.event;

import org.springframework.context.ApplicationEvent;

public class SyncOrderEvent extends ApplicationEvent {

    private final String orderId;

    public SyncOrderEvent(Object source, String orderId) {
        super(source);
        this.orderId = orderId;
    }

    public String getOrderId() {
        return orderId;
    }
}
