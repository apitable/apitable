package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书租户信息
 *
 * @author Shawn Deng
 * @date 2020-12-09 10:49:13
 */
@Data
@ApiModel("飞书租户信息")
public class FeishuTenantInfoVO {

    @ApiModelProperty(value = "成员人数", example = "100")
    private Integer memberCount;
}
