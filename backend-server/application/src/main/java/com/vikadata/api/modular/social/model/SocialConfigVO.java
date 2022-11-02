package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Third party integrated configuration information view
 */
@Data
@ApiModel("Third party integrated configuration information view")
public class SocialConfigVO {

    @ApiModelProperty(value = "Platform( 1: WeCom, 2: DingTalk, 3: Lark)", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer platform;

    @ApiModelProperty(value = "Enable", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enable;

    @ApiModelProperty(value = "Application ID", position = 3)
    private String appId;

    @ApiModelProperty(value = "Service provider application or not", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isv;
}
