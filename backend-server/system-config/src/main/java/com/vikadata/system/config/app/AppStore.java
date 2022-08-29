package com.vikadata.system.config.app;

import lombok.Data;

import com.vikadata.system.config.common.Appendix;

/**
 * 应用商店
 * @author Shawn Deng
 * @date 2022-01-12 16:19:19
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
