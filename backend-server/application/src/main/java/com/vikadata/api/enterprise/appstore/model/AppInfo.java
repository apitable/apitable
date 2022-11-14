package com.vikadata.api.enterprise.appstore.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * Application Information View
 */
@Data
@ApiModel("Application Information View")
public class AppInfo {

    @ApiModelProperty(value = "Application ID", dataType = "String", example = "app-jh1237123")
    private String appId;

    @ApiModelProperty(value = "Apply name", dataType = "String", example = "Lark")
    private String name;

    @ApiModelProperty(value = "Type(LARK、WECOM、DINGTALK)", dataType = "String", example = "LARK")
    private String type;

    @ApiModelProperty(value = "Application Type(See the catalog for details)", dataType = "String", example = "SOCIAL")
    private String appType;

    @ApiModelProperty(value = "Application status", dataType = "String", example = "ACTIVE")
    private String status;

    @ApiModelProperty(value = "Application Introduction", dataType = "String", example = "Seamless combination with Lark")
    private String intro;

    @ApiModelProperty(value = "Help Document Path", dataType = "String", example = "/help/path")
    private String helpUrl;

    @ApiModelProperty(value = "Application Description", dataType = "String", example = "long text")
    private String description;

    @ApiModelProperty(value = "Display the picture list in order", dataType = "List", example = "[url1, url2....]")
    private List<String> displayImages;

    @ApiModelProperty(value = "Notes", dataType = "String", example = "Be careful：xxx")
    private String notice;

    @ApiModelProperty(value = "Application LOGO address", dataType = "String", example = "feishu_logo")
    private String logoUrl;

    @ApiModelProperty(value = "Whether configuration is required", dataType = "Boolean", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean needConfigured;

    @ApiModelProperty(value = "Configure Jump Path", dataType = "String", example = "/path")
    private String configureUrl;

    @ApiModelProperty(value = "Disable the adjustment link. If there is no adjustment link, there is no need to jump", dataType = "String", example = "https://feishu.cn/admin/xxx")
    private String stopActionUrl;

    @ApiModelProperty(value = "Whether authorization enabling operation is required", dataType = "Boolean", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean needAuthorize;
}
