package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
* <p>
* DingTalk Association Request Parameters
* </p>
*/
@Data
@ApiModel("DingTalk Association Request Parameters")
public class DtBindOpRo {

    @ApiModelProperty(value = "Area code", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "Phone number", example = "133...", position = 1, required = true)
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @ApiModelProperty(value = "Unique identification within open applications", example = "liSii8KC", position = 2, required = true)
    @NotBlank(message = "open Id cannot be empty")
    private String openId;

    @ApiModelProperty(value = "Unique ID in the developer enterprise", example = "PiiiPyQqBNBii0HnCJ3zljcuAiEiE", position = 3, required = true)
    @NotBlank(message = "The union ID cannot be empty")
    private String unionId;
}
