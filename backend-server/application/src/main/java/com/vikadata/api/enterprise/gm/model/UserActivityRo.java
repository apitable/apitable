package com.vikadata.api.enterprise.gm.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("User Activity Ro")
public class UserActivityRo {

    @ApiModelProperty(value = "wizard id", example = "7", position = 1)
    private Integer wizardId;
}
