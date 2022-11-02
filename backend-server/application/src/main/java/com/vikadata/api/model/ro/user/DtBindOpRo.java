package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
* <p>
* 钉钉关联请求参数
* </p>
*
* @author Chambers
* @date 2019/12/5
*/
@Data
@ApiModel("钉钉关联请求参数")
public class DtBindOpRo {

    @ApiModelProperty(value = "区号", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "手机号码", example = "133...", position = 1, required = true)
    @NotBlank(message = "手机号码不能为空")
    private String phone;

    @ApiModelProperty(value = "开放应用内的唯一标识", example = "liSii8KC", position = 2, required = true)
    @NotBlank(message = "openId不能为空")
    private String openId;

    @ApiModelProperty(value = "开发者企业内的唯一标识", example = "PiiiPyQqBNBii0HnCJ3zljcuAiEiE", position = 3, required = true)
    @NotBlank(message = "unionId不能为空")
    private String unionId;
}
