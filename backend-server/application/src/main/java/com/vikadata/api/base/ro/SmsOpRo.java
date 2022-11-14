package com.vikadata.api.base.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Mobile verification code request parameters
 */
@Data
@ApiModel("Mobile verification code request parameters")
public class SmsOpRo {

    @ApiModelProperty(value = "Area code", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "cell-phone number", example = "131...", position = 1, required = true)
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @ApiModelProperty(value = "SMS verification code type", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @ApiModelProperty(value = "Man machine verification, the front end obtains the value of get NVC Val function", example = "BornForFuture", position = 3)
    private String data;
}
