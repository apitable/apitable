package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 邀请码奖励请求参数
 * </p> 
 * @author Shawn Deng 
 * @date 2022/4/7 21:39
 */
@Data
@ApiModel("邀请码奖励请求参数")
public class InviteCodeRewardRo {

    @NotBlank(message = "邀请码不能为空")
    @Size(min = 8, max = 8, message = "邀请码长度只能是8位")
    @ApiModelProperty(value = "邀请码", example = "12345678", position = 1, required = true)
    private String inviteCode;
}
