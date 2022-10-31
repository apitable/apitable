package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Self built application generates callback address request parameters
 */
@ApiModel("Lark Application Basic Configuration Request Parameters")
@Data
public class FeishuAppConfigRo {

    @ApiModelProperty(value = "App ID", dataType = "String", example = "123456", position = 1)
    private String appKey;

    @ApiModelProperty(value = "App Key", dataType = "String", example = "1", position = 1)
    private String appSecret;
}
