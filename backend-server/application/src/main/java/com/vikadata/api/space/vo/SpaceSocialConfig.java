package com.vikadata.api.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;

/**
 * Third party integrated information of space
 */
@Data
@ApiModel("Third party integrated binding information of the space")
public class SpaceSocialConfig {

    @ApiModelProperty(value = "Whether the third party platform binding is enabled for the space", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @ApiModelProperty(value = "Third party platform type（1: WeCom, 2: DingTalk, 3: Lark）", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer platform;

    @ApiModelProperty(value = "App ID", example = "1", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private String appId;

    @ApiModelProperty(value = "Application Type(1: Enterprise self built application, 2: Independent service provider)", example = "1", position = 4)
    private Integer appType;

    @ApiModelProperty(value = "Authorization mode. 1: Enterprise authorization; 2: Member Authorization", example = "1", position = 5)
    private Integer authMode;

    @ApiModelProperty(value = "Whether the address book is being synchronized", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean contactSyncing;
}
