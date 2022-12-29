package com.vikadata.api.organization.ro;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.constants.PatternConstants;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * Invite Member Parameters
 * </p>
 */
@Data
@ApiModel("Invite Member Parameters")
public class InviteMemberRo {

    @ApiModelProperty(value = "Email address, strictly checked", example = "123456@qq.com", required = true, position = 1)
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "Assign department ID, optional. If it is not transferred, it will be added under the root door of the space by default", dataType = "java.lang.String", example = "16272126", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
