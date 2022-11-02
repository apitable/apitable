package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Hq add user Ro")
public class HqAddUserRo {

    @NotBlank
    @ApiModelProperty(value = "username", required = true, position = 2)
    private String username;

    private String phone;

    @NotBlank
    @ApiModelProperty(value = "password", required = true, position = 3)
    private String password;
}
