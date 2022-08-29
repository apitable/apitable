package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书租户绑定空间站请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-01 11:39:46
 */
@Data
@ApiModel("飞书租户绑定空间站请求参数")
public class FeishuTenantBindSpaceDTO {

    @ApiModelProperty(value = "空间站标识", example = "spc2123hjhasd")
    private String spaceId;
}
