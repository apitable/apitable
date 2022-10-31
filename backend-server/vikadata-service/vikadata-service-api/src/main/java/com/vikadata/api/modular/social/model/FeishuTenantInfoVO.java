package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Tenant information
 */
@Data
@ApiModel("Lark Tenant information")
public class FeishuTenantInfoVO {

    @ApiModelProperty(value = "Number of members", example = "100")
    private Integer memberCount;
}
