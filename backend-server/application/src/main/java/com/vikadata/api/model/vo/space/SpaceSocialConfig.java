package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * 空间的第三方集成信息
 *
 * @author Shawn Deng
 * @date 2020-12-17 18:03:02
 */
@Data
@ApiModel("空间的第三方集成绑定信息")
public class SpaceSocialConfig {

    @ApiModelProperty(value = "空间是否开启第三方平台绑定", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @ApiModelProperty(value = "第三方平台类型（1: 企业微信, 2: 钉钉, 3: 飞书）", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer platform;

    @ApiModelProperty(value = "应用ID", example = "1", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private String appId;

    @ApiModelProperty(value = "应用类型(1: 企业自建应用, 2: 独立服务商)", example = "1", position = 4)
    private Integer appType;

    @ApiModelProperty(value = "授权模式。1：企业授权；2：成员授权", example = "1", position = 5)
    private Integer authMode;

    @ApiModelProperty(value = "是否正在同步通讯录", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean contactSyncing;
}
