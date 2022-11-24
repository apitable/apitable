package com.vikadata.api.shared.sysconfig.notification;

import lombok.Data;

/**
 * <p>
 * Social App Message Template
 * </p>
 */
@Data
public class SocialTemplate {
    private String id;

    private String templateString;

    private String title;

    /**
     * jump address
     */
    private String url;

    /**
     * picture url
     */
    private String picUrl;

    private String messageType;

    private String platform;

    private String notificationTemplateId;

    /**
     * jump address title
     */
    private String urlTitle;

    private String appId;
}
