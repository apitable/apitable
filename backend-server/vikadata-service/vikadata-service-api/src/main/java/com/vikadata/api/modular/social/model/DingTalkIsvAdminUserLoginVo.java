package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * 钉钉ISV用户登录请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-15 12:15:47
 */
@ApiModel("钉钉应用工作台管理员登录返回信息")
@Data
public class DingTalkIsvAdminUserLoginVo {
    @ApiModelProperty(value = "应用绑定的空间站ID", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;

    @ApiModelProperty(value = "第三方授权组织的企业ID", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String corpId;
}
