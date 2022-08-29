package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 空间更换主管理员请求参数
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/17 17:53
 */
@Data
@ApiModel("钉钉租户空间更换主管理员请求参数")
public class DingTalkTenantMainAdminChangeRo {

    @ApiModelProperty(value = "空间站标识", example = "spc2123hjhasd", required = true)
    @NotBlank(message = "空间ID不能为空")
    private String spaceId;

    @ApiModelProperty(value = "新主管理员的成员ID", example = "123456", position = 2, required = true)
    @NotNull(message = "新主管理员的成员ID不能为空")
    private Long memberId;

    @ApiModelProperty(value = "第三方组织ID", example = "ddsddd", position = 3, required = true)
    @NotNull(message = "第三方组织ID不能为空")
    private String corpId;
}
