package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Get SKU page of internal products
 * </p>
 */
@ApiModel("DingTalk--Get SKU page of internal products")
@Data
public class DingTalkInternalSkuPageRo {
    @ApiModelProperty(value = "Space ID", required = true, position = 1)
    @NotNull
    private String spaceId;

    @ApiModelProperty(value = "Callback page", position = 2)
    private String callbackPage;

    @ApiModelProperty(value = "If this value is passed in, it will be pushed when the order message is pushed.", position = 3)
    private String extendParam;
}
