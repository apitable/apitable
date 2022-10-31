package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Ding Talk application tenant binding space request parameters
 * </p>
 */
@Data
@ApiModel("Ding Talk application tenant binding space request parameters")
public class DingTalkAgentBindSpaceDTO {

    @ApiModelProperty(value = "Space identification", example = "spc2123hjhasd")
    private String spaceId;
}
