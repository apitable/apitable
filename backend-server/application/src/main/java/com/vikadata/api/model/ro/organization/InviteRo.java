package com.vikadata.api.model.ro.organization;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Email invitation member request parameters
 * </p>
 */
@Data
@ApiModel("Email invitation member request parameters")
public class InviteRo {

    @Valid
    @NotEmpty
    @Size(max = 50, message = "Invite up to 50 members")
    @ApiModelProperty(value = "Invite Member List", required = true, position = 3)
    private List<InviteMemberRo> invite;

    @ApiModelProperty(value = "Password login for human-machine verification, and the front end obtains the value of get NVC Val function (human-machine verification will be performed when not logged in)", example = "FutureIsComing", position = 5)
    private String data;
}
