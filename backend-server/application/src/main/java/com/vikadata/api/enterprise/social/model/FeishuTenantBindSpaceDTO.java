package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Tenant binding space request parameters
 */
@Data
@ApiModel("Lark Tenant binding space request parameters")
public class FeishuTenantBindSpaceDTO {

    @ApiModelProperty(value = "Space identification", example = "spc2123hjhasd")
    private String spaceId;
}
