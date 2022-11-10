package com.vikadata.api.model.ro.organization;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * Send an email again to invite member request parameters
 * </p>
 */
@Data
@ApiModel("Send an email again to invite member request parameters")
public class InviteMemberAgainRo {

    @NotNull(message = "The mailbox does not exist, and the invitation cannot be sent again")
    @ApiModelProperty(value = "Email address, strictly checked", example = "123456@qq.com", required = true, position = 1)
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags = Flag.CASE_INSENSITIVE)
    private String email;
}
