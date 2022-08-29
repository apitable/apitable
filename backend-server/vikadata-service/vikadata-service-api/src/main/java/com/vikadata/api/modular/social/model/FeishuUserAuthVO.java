package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书登录用户身份
 *
 * @author Shawn Deng
 * @date 2020-12-07 12:08:46
 */
@Data
@ApiModel("飞书登录用户身份")
public class FeishuUserAuthVO {

    @ApiModelProperty(value = "用户在维格应用里的唯一标识", position = 1)
    private String openId;

    @ApiModelProperty(value = "登录用户所在的企业标识", position = 2)
    private String tenantKey;

    @ApiModelProperty(value = "登录用户姓名", position = 3)
    private String name;

    @ApiModelProperty(value = "用户头像", position = 4)
    private String avatarUrl;

    @ApiModelProperty(value = "用户头像 72x72", position = 5)
    private String avatarThumb;

    @ApiModelProperty(value = "用户头像 240x240", position = 6)
    private String avatarMiddle;

    @ApiModelProperty(value = "用户头像 640x640", position = 7)
    private String avatarBig;

    @ApiModelProperty(value = "是否绑定用户", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean bindUser;
}
