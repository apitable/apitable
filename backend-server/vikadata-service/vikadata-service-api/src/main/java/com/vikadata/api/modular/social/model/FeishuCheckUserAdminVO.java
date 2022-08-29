package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 校验飞书登录用户是否管理员
 *
 * @author Shawn Deng
 * @date 2020-12-07 12:08:46
 */
@Data
@ApiModel("校验飞书登录用户是否管理员")
public class FeishuCheckUserAdminVO {

    @ApiModelProperty(value = "是否管理员", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;
}
