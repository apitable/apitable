package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Space Certification Ro")
public class SpaceCertificationRo {

    @NotBlank(message = "the space id cannot be empty")
    @ApiModelProperty(value = "space id", required = true, example = "spcNrqN2iH0qK", position = 1)
    private String spaceId;

    @NotBlank(message = "user uuid")
    @ApiModelProperty(value = "user uuid", required = true, example = "dfada", position = 2)
    private String uuid;

    @NotBlank(message = "authentication level")
    @ApiModelProperty(value = "authentication level", required = true, example = "basic/senior", position = 3)
    private String certification;
}
