package com.vikadata.api.shared.sysconfig.app;

import lombok.Data;

import com.vikadata.api.shared.sysconfig.common.Appendix;

/**
 * <p>
 * App Store
 * </p>
 */
@Data
public class AppStore {

    private String id;

    private String appName;

    private Appendix logo;

    private String type;

    private String appType;

    private String intro;

    private String description;

    private String status;

    private Integer displayOrder;

    private Appendix inlineImage;

    private String notice;

    private boolean needConfigured;

    private String configureUrl;

    private boolean needAuthorize;

    private String helpUrl;

    private String stopActionUrl;

}
