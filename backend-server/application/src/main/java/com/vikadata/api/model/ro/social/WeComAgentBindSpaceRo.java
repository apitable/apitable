package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企业微信应用租户绑定空间站请求参数
 * </p>
 * @author Pengap
 * @date 2021/8/1 18:05:15
 */
@Data
@ApiModel("企业微信应用租户绑定空间站请求参数")
public class WeComAgentBindSpaceRo {

    @NotBlank
    @ApiModelProperty(value = "空间站标识", example = "spc2123hjhasd")
    private String spaceId;

    @NotBlank
    @ApiModelProperty(value = "用户允许授权后,重定向返回的code参数", example = "CODE")
    private String code;

}
