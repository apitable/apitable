package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 邀请链接校验参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 10:23
 */
@Data
@ApiModel("邀请链接校验参数")
public class InviteValidRo {

    @NotBlank
    @ApiModelProperty(value = "邀请链接一次性令牌", example = "b10e5e36cd7249bdaeab3e424308deed", position = 1)
    private String token;

    @ApiModelProperty(value = "nodeId", example = "dst****", position = 2)
    private String nodeId;
}
