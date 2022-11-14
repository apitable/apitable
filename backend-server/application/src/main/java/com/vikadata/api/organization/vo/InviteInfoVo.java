package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Invitation Information View
 * </p>
 */
@Data
@ApiModel("Invitation Information View")
public class InviteInfoVo {

    @ApiModelProperty(value = "Space ID", example = "spcyQkKp9XJEl", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Space name", example = "Work space", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "Invite Users", example = "Zhang San", position = 3)
    private String inviter;

    @ApiModelProperty(value = "Invited Email", example = "xxxx@vikadata.com", position = 4)
    private String inviteEmail;

    @ApiModelProperty(value = "Whether it is in login status", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "Whether the invited mailbox has an account bound", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isBound;

    @ApiModelProperty(value = "Inviter's personal invitation code", example = "vikatest", position = 7)
    private String inviteCode;
}
