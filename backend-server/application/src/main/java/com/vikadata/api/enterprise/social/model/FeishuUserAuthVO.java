package com.vikadata.api.enterprise.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Login user identity
 */
@Data
@ApiModel("Lark Login user identity")
public class FeishuUserAuthVO {

    @ApiModelProperty(value = "The user's unique ID in the vika application", position = 1)
    private String openId;

    @ApiModelProperty(value = "Enterprise ID of the login user", position = 2)
    private String tenantKey;

    @ApiModelProperty(value = "Login User Name", position = 3)
    private String name;

    @ApiModelProperty(value = "User avatar", position = 4)
    private String avatarUrl;

    @ApiModelProperty(value = "User avatar 72x72", position = 5)
    private String avatarThumb;

    @ApiModelProperty(value = "User avatar 240x240", position = 6)
    private String avatarMiddle;

    @ApiModelProperty(value = "User avatar 640x640", position = 7)
    private String avatarBig;

    @ApiModelProperty(value = "Bind user or not", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean bindUser;
}
