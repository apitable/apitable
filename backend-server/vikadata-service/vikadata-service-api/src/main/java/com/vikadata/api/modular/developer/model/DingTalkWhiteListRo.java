package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 总部命令添加钉钉空间白名单
 * </p>
 *

 */
@Data
@ApiModel("总部命令添加钉钉空间白名单")
public class DingTalkWhiteListRo {

    @NotBlank
    @ApiModelProperty(value = "记录订单维格表", required = true, position = 1)
    private String dstId;

    @NotBlank
    @ApiModelProperty(value = "视图ID", required = true, position = 2)
    private String viewId;

    @NotBlank(message = "appId不能为空")
    @ApiModelProperty(value = "第三方应用ID", required = true, position = 3)
    private String appId;
}
