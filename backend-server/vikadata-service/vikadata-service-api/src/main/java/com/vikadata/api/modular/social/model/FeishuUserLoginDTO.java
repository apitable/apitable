package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * Lark User Login Request Parameters
 */
@ApiModel("Lark User Login Request Parameters")
@Data
public class FeishuUserLoginDTO {

    @NotBlank
    @ApiModelProperty(value = "Lark User ID", required = true, position = 1)
    private String openId;

    @NotBlank
    @ApiModelProperty(value = "Login user's enterprise ID", required = true, position = 2)
    private String tenantKey;
}
