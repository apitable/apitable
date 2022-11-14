package com.vikadata.api.organization.ro;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.constants.PatternConstants;

/**
 * <p>
 * User verification and comparison of invited mailbox parameters
 * </p>
 */
@Data
@ApiModel("User verification and comparison of invited mailbox parameters")
public class CheckUserEmailRo {

    @ApiModelProperty(value = "Email address, strictly checked", example = "123456@qq.com", required = true, position = 1)
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags = Flag.CASE_INSENSITIVE)
    private String email;
}
