package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 第三方集成配置信息视图
 *
 * @author Shawn Deng
 * @date 2020-12-02 17:43:50
 */
@Data
@ApiModel("第三方集成配置信息视图")
public class SocialConfigVO {

    @ApiModelProperty(value = "所属平台( 1: 企业微信, 2: 钉钉, 3: 飞书)", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer platform;

    @ApiModelProperty(value = "是否启用", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enable;

    @ApiModelProperty(value = "应用标识", position = 3)
    private String appId;

    @ApiModelProperty(value = "是否服务商应用", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isv;
}
