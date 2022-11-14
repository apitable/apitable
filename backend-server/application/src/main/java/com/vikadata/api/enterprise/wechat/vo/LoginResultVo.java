package com.vikadata.api.enterprise.wechat.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 *
 * <p>
 * WeChat login result vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("WeChat login result vo")
public class LoginResultVo {

    @Builder.Default
    @ApiModelProperty(value = "Whether the vika account has been bound", example = "false", position = 1)
    private Boolean isBind = false;

    @Builder.Default
    @ApiModelProperty(value = "Whether it is necessary to create a space indicates that the user does not have any space association, which is a standard field for space creation guidance", example = "false", position = 2)
    private Boolean needCreate = true;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Nickname", example = "Zhang San, when the content is empty, you need to enter the screen name setting page", position = 3)
    private String nickName;

    @ApiModelProperty(value = "Is it a new registered user", hidden = true)
    private boolean newUser;

    @ApiModelProperty(value = "New registered user table ID", hidden = true)
    private Long userId;

    @ApiModelProperty(value = "Whether the union id already exists", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasUnion;
}
