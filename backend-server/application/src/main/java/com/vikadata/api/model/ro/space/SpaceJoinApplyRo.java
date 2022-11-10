package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Request parameters of space joining application
 * </p>
 */
@Data
@ApiModel("Request parameters of space joining application")
public class SpaceJoinApplyRo {

    @ApiModelProperty(value = "Space ID", required = true, example = "spczdmQDfBAn5", position = 1)
    @NotBlank(message = "Space ID cannot be empty")
    private String spaceId;
}
