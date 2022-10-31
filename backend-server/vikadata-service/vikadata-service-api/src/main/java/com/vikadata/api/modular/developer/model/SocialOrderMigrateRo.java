package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Social Order Migrate Ro")
public class SocialOrderMigrateRo {

    @NotBlank(message = "third party board")
    @ApiModelProperty(value = "1: wecom 2: dingtalk 3: feishu", required = true, example = "2", position = 1)
    private Integer platformType;


    @ApiModelProperty(value = "space id ", example = "spc***", position = 2)
    private String spaceId;
}
