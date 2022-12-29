package com.vikadata.social.feishu.event;

import lombok.Getter;
import lombok.Setter;

/**
 * Event Subscription Basic Properties
 */
@Setter
@Getter
public class BaseEvent {

    private String appInstanceId;

    private String appId;

    private String tenantKey;

    private String type;

    private Meta meta;

    @Setter
    @Getter
    public static class Meta {

        private String uuid;

        private String ts;
    }
}
