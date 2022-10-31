package com.vikadata.api.modular.space.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("Invited User")
public class InviteUserInfo {

    /**
     * 用户Id
     */
    private String userId;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 头像
     */
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;
}
