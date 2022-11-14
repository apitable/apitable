package com.vikadata.api.user.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Developer Configuration Information View
 * </p>
 */
@Data
@ApiModel("Developer Configuration Information View")
public class DeveloperInfoVo {

    @ApiModelProperty(value = "Access Token", example = "Zhang San", position = 1)
    private String apiKey;
}
