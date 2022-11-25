package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.model.v3.Avatar;

/**
 * Corporate Information
 */
@Setter
@Getter
public class FeishuTenantInfo {

    /**
     * Company Name
     */
    private String name;

    /**
     * Enterprise number
     */
    private String displayId;

    /**
     * Personal Edition Team Edition logo
     * 0: Team Edition
     * 2: Personal Edition
     */
    private String tenantTag;

    /**
     * Corporate key
     */
    private String tenantKey;

    /**
     * Corporate avatar
     */
    private Avatar avatar;
}
