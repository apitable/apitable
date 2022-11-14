package com.vikadata.api.enterprise.gm.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("We Com Isv New Space Ro")
public class WeComIsvNewSpaceRo {

    @ApiModelProperty("suite id")
    @NotBlank
    private String suiteId;

    @ApiModelProperty("auth corp id")
    @NotBlank
    private String authCorpId;

}
