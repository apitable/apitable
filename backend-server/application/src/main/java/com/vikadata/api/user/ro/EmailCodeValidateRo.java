package com.vikadata.api.user.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.constants.PatternConstants;

/**
 * <p>
 * Mailbox verification code verification request parameters
 * </p>
 */
@Data
@ApiModel("Mailbox verification code verification request parameters")
public class EmailCodeValidateRo {

    @ApiModelProperty(value = "e-mail address", example = "xxxx@vikadata.com", position = 1, required = true)
    @NotBlank(message = "Email address cannot be empty")
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "Email verification code", example = "123456", position = 2, required = true)
    @NotBlank(message = "The verification code cannot be empty")
    private String code;
}
