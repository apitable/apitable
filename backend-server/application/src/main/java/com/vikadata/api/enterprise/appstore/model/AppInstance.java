package com.vikadata.api.enterprise.appstore.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * Space Application Information View
 */
@Data
@ApiModel("Space application instance view")
public class AppInstance {

    @ApiModelProperty(value = "Space Id", example = "spc21u12h3")
    private String spaceId;

    @ApiModelProperty(value = "Application logo of application store", example = "app-jh1237123")
    private String appId;

    @ApiModelProperty(value = "Application instance ID", example = "ai-jh1237123")
    private String appInstanceId;

    @ApiModelProperty(value = "Enable", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isEnabled;

    @ApiModelProperty(value = "Type(LARK、WECOM、DINGTALK)", example = "LARK")
    private String type;

    @ApiModelProperty(value = "Application instance configuration(Different types, different configuration contents, and generic reception)")
    private InstanceConfig config;

    @ApiModelProperty(value = "Creation time", dataType = "string", example = "2020-03-18T15:29:59.000", position = 12)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
