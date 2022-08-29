package com.vikadata.api.component.notification.subject;

import lombok.Data;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;

@Data
public class SocialNotifyContext {
    /**
     * 应用ID
     */
    private String appId;

    /**
     * 授权企业ID
     */
    private String tenantId;

    /**
     * 应用类型
     */
    private SocialAppType appType;

    /**
     * 应用平台
     */
    private SocialPlatformType platform;

    /**
     * 入口页地址
     */
    private String entryUrl;

    /**
     * wecom/dingtalk 自建应用需要
     */
    private String agentId;

}
