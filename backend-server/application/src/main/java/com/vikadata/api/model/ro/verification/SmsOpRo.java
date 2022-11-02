package com.vikadata.api.model.ro.verification;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 手机验证码请求参数
 *
 * @author Chambers
 * @since 2019/10/14
 */
@Data
@ApiModel("手机验证码请求参数")
public class SmsOpRo {

    @ApiModelProperty(value = "区号", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "手机号", example = "131...", position = 1, required = true)
    @NotBlank(message = "手机号码不能为空")
    private String phone;

    @ApiModelProperty(value = "短信验证码类型", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "人机验证，前端获取getNVCVal函数的值", example = "BornForFuture", position = 3)
    private String data;
}
