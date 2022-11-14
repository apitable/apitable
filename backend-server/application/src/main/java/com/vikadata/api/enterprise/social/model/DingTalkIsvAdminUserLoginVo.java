package com.vikadata.api.enterprise.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * DingTalk ISV User Login Request Parameters
 */
@ApiModel("DingTalk Application Workbench Administrator Login Return Information")
@Data
public class DingTalkIsvAdminUserLoginVo {
    @ApiModelProperty(value = "Space ID bound by the application", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;

    @ApiModelProperty(value = "Enterprise ID of the third-party authorized organization", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String corpId;
}
