package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.support.serializer.NullStringSerializer;

/** 
* <p> 
* Binding space information for Ding Talk
* </p>
*/
@ApiModel("Binding space information for Ding Talk")
@Data
@Builder
public class DingTalkBindSpaceVo {
    @ApiModelProperty(value = "Space ID bound by the application", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;
}
