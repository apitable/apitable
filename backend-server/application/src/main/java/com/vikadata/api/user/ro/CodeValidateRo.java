package com.vikadata.api.user.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Verification code verification request parameters
 * </p>
 */
@Data
@ApiModel("Mobile verification code verification request parameters")
public class CodeValidateRo {

    @ApiModelProperty(value = "Verification Code", example = "123456", position = 3, required = true)
    @NotBlank(message = "The verification code cannot be empty")
    private String code;

}
