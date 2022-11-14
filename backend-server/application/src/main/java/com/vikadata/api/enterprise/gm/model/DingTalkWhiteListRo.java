package com.vikadata.api.enterprise.gm.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * GM add DingTalk white list
 * </p>
 *
 */
@Data
@ApiModel("GM add DingTalk white list Ro")
public class DingTalkWhiteListRo {

    @NotBlank
    @ApiModelProperty(value = "record the order form", required = true, position = 1)
    private String dstId;

    @NotBlank
    @ApiModelProperty(value = "view id", required = true, position = 2)
    private String viewId;

    @NotBlank(message = "The app Id cannot be blank")
    @ApiModelProperty(value = "third party application id", required = true, position = 3)
    private String appId;
}
