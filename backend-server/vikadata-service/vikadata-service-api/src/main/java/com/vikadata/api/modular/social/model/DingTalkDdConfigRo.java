package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * DingTalk Get the dd.config parameter
 * </p>
 */
@ApiModel("DingTalk Get the dd.config parameter")
@Data
public class DingTalkDdConfigRo {
    @ApiModelProperty(value = "Space ID", required = true, position = 1)
    @NotNull
    private String spaceId;

    @ApiModelProperty(value = "Current page address", position = 2)
    @NotNull
    private String url;
}
