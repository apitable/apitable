package com.vikadata.api.enterprise.social.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.DesensitizedSecretSerializer;

/**
 * <p>
 * WeCom Bound Profile View
 * </p>
 */
@Data
@ApiModel("WeCom Bound Profile View")
public class WeComBindConfigVo {

    @ApiModelProperty(value = "Enterprise Id", position = 1)
    private String corpId;

    @ApiModelProperty(value = "Self built application ID", position = 2)
    private Integer agentId;

    @ApiModelProperty(value = "Self built application key", position = 3)
    @JsonSerialize(using = DesensitizedSecretSerializer.class)
    private String agentSecret;

    @ApiModelProperty(value = "Self built application status (0: enabled, 1: disabled)", position = 4)
    private Integer agentStatu;

    @ApiModelProperty(value = "Enterprise exclusive domain name", example = "spcxqmlr2lusd.enp.vika.ltd", position = 5)
    private String domainName;

}
