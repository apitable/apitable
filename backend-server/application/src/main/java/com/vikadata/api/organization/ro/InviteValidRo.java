package com.vikadata.api.organization.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Invitation link verification parameters
 * </p>
 */
@Data
@ApiModel("Invitation link verification parameters")
public class InviteValidRo {

    @NotBlank
    @ApiModelProperty(value = "Invite link one-time token", example = "b10e5e36cd7249bdaeab3e424308deed", position = 1)
    private String token;

    @ApiModelProperty(value = "nodeId", example = "dst****", position = 2)
    private String nodeId;
}
