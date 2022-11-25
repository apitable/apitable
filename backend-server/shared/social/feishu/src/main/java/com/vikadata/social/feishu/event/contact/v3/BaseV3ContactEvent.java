package com.vikadata.social.feishu.event.contact.v3;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BaseV3ContactEvent {

    private String appInstanceId;

    private String schema;

    private Header header;

    @Setter
    @Getter
    public static class Header {

        private String appId;

        private String tenantKey;

        private String eventType;

        private String eventId;

        private String createTime;
    }
}
