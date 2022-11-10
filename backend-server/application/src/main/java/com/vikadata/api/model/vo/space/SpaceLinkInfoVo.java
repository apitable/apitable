package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space public invitation link information vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Space public invitation link information vo")
public class SpaceLinkInfoVo {

    @ApiModelProperty(value = "Creator name", example = "Zhang San", position = 1)
    private String memberName;

    @ApiModelProperty(value = "Space name", example = "This is a space", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "Space ID", example = "spc10", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceId;

    @ApiModelProperty(value = "Whether it is in login status, not logged in", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "Whether it already exists in the space, and directly call the switching space interface in the existing space", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isExist;

    @ApiModelProperty(value = "Inviter's personal invitation code", example = "vikatest", position = 6)
    private String inviteCode;
}
