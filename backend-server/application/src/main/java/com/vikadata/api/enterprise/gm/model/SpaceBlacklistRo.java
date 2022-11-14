package com.vikadata.api.enterprise.gm.model;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Space Blacklist Ro")
public class SpaceBlacklistRo {

    @ApiModelProperty(value = "space ids", required = true, example = "[\"spczJrh2i3tLW\",\"spczdmQDfBAn5\"]", position = 1)
    @NotEmpty(message = "the space id cannot be empty")
    private List<String> spaceIds;

    @ApiModelProperty(value = "status of blacklist", required = true, example = "true", position = 2)
    @NotNull(message = "status cannot be null")
    private Boolean status;

}
