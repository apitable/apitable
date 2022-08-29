package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 第三方用户绑定状态
 *
 * @author Shawn Deng
 * @date 2020-12-11 15:14:48
 */
@Data
@ApiModel("第三方用户绑定状态")
public class SocialUserBindStatusVO {

    @ApiModelProperty(value = "状态", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean status;
}
