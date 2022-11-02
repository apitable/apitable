package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * DingTalk ISV User Login Request Parameters
 */
@ApiModel("DingTalk ISV User Login Request Parameters")
@Data
public class DingTalkIsvUserLoginVo {
    @ApiModelProperty(value = "Space ID bound by the application", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;

    @ApiModelProperty(value = "Need to modify the name", position = 2)
    private Boolean shouldRename;

    @ApiModelProperty(value = "Default name", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String defaultName;
}
