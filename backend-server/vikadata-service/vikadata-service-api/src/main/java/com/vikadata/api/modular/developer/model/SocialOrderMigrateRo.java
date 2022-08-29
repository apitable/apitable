package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 第三方订单同步
 * </p>
 * @author zoe zheng
 * @date 2022/4/6 16:20
 */
@Data
@ApiModel("第三方订单同步")
public class SocialOrderMigrateRo {

    @NotBlank(message = "第三方平台")
    @ApiModelProperty(value = "第三方平台1:企业微信,2:钉钉 3:飞书 ", required = true, example = "2", position = 1)
    private Integer platformType;


    @ApiModelProperty(value = "空间站ID ", example = "spc***", position = 2)
    private String spaceId;
}
