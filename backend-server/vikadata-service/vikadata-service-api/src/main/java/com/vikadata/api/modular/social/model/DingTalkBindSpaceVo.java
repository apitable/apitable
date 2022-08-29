package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.support.serializer.NullStringSerializer;

/** 
* <p> 
* 钉钉用用绑定空间信息
* </p> 
* @author zoe zheng 
* @date 2021/5/28 5:36 下午
*/
@ApiModel("钉钉用用绑定空间信息")
@Data
@Builder
public class DingTalkBindSpaceVo {
    @ApiModelProperty(value = "应用绑定的空间站ID", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;
}
