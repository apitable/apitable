package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * WeCom application user login request parameters
 * </p>
 */
@Data
@ApiModel("WeCom application user login request parameters")
public class WeComUserLoginRo {

    @NotBlank
    @ApiModelProperty(value = "Enterprise Id", required = true, position = 1)
    private String corpId;

    @NotNull
    @ApiModelProperty(value = "Self built application ID", required = true, position = 2)
    private Integer agentId;

    @NotBlank
    @ApiModelProperty(value = "Registration free authorization code", required = true, position = 3)
    private String code;

}
