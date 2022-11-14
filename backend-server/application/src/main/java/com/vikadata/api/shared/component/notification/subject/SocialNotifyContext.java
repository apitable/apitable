package com.vikadata.api.shared.component.notification.subject;

import lombok.Data;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialAppType;

@Data
public class SocialNotifyContext {

    private String appId;

    private String tenantId;

    private SocialAppType appType;

    private SocialPlatformType platform;

    private String entryUrl;

    /**
     * wecom/dingtalk self-hosted need
     */
    private String agentId;

}
