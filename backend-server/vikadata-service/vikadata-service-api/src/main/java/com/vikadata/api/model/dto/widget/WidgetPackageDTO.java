package com.vikadata.api.model.dto.widget;

import lombok.Data;

@Data
public class WidgetPackageDTO {

    private Long id;

    private String packageId;

    private String name;

    private String description;

    private String icon;

    private String cover;

    private Integer status;

    private Integer installedNum;

    private String authorName;

    private String authorIcon;

    private String authorEmail;

    private String authorLink;

    private Integer packageType;

    private Integer releaseType;

    private String version;

    private String releaseCodeBundle;

    private Boolean sandbox;

    @Deprecated
    private String nameEn;

    private String fatherWidgetId;

    private String installEnvCode;

    private String runtimeEnvCode;
}
