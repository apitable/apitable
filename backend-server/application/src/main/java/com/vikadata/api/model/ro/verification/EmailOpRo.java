package com.vikadata.api.model.ro.verification;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * Mailbox verification code request parameters
 */
@Data
@ApiModel("Mailbox verification code request parameters")
public class EmailOpRo {

    @ApiModelProperty(value = "Email", example = "...@vikadata.com", position = 1, required = true)
    @NotBlank(message = "Email cannot be empty")
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect email format", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "SMS verification code type", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;
}
