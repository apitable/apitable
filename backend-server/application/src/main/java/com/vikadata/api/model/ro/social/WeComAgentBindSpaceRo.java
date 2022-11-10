package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * WeCom application tenants bind space station request parameters
 * </p>
 */
@Data
@ApiModel("We Com application tenants bind space station request parameters")
public class WeComAgentBindSpaceRo {

    @NotBlank
    @ApiModelProperty(value = "Space identification", example = "spc2123hjhasd")
    private String spaceId;

    @NotBlank
    @ApiModelProperty(value = "The code parameter returned by redirection after the user allows authorization", example = "CODE")
    private String code;

}
