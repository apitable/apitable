package com.vikadata.api.enterprise.social.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * WeCom checks the application binding configuration request parameters
 * </p>
 */
@Data
@ApiModel("WeCom check application binding configuration request parameters")
public class WeComCheckConfigRo {

    @NotBlank
    @ApiModelProperty(value = "Enterprise Id", required = true, position = 1)
    private String corpId;

    @NotNull
    @ApiModelProperty(value = "Self built application ID", required = true, position = 2)
    private Integer agentId;

    @NotBlank
    @ApiModelProperty(value = "Self built application key", required = true, position = 3)
    private String agentSecret;

}
