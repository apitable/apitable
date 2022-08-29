package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 校验飞书企业是否已经绑定过空间站
 *
 * @author Shawn Deng
 * @date 2020-12-07 12:08:46
 */
@Data
@ApiModel("校验飞书企业是否已经绑定过空间站")
public class FeishuTenantBindVO {

    @ApiModelProperty(value = "是否已绑定", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasBind;
}
