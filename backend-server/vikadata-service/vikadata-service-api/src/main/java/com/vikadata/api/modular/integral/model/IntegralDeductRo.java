package com.vikadata.api.modular.integral.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 积分扣除请求参数
 * </p>
 *
 * @author Chambers
 * @date 2022/7/15
 */
@Data
@ApiModel("积分扣除请求参数")
public class IntegralDeductRo {

    @ApiModelProperty(value = "用户ID", example = "12511", position = 1)
    private Long userId;

    @ApiModelProperty(value = "区号", example = "+86", position = 2)
    private String areaCode;

    @ApiModelProperty(value = "帐号凭证（手机或邮箱）", example = "xx@gmail.com", position = 3)
    private String credential;

    @ApiModelProperty(value = "扣除的积分值", example = "100", required = true, position = 4)
    private Integer credit;
}
