package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * <p>
 * Ding Talk Creation Template
 * </p>
 */
@Data
public class DingTalkDaCreateTemplateDTO {

    /**
     * Application instance ID
     */
    private String bizAppId;

    /**
     * Mobile terminal opening address
     */
    private String homepageLink;

    /**
     * Opening address of PC terminal
     */
    private String pcHomepageLink;

    /**
     * Mobile terminal editing page opening address
     */
    private String homepageEditLink;

    /**
     * Opening address of edit page on PC side
     */
    private String pcHomepageEditLink;
}
