package com.vikadata.api.enterprise.social.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * WeCom application user login return information
 * </p>
 */
@Data
@ApiModel("WeCom application user login return information")
public class WeComUserLoginVo {

    @ApiModelProperty(value = "Space ID bound by the application", position = 1)
    private String bindSpaceId;

}
