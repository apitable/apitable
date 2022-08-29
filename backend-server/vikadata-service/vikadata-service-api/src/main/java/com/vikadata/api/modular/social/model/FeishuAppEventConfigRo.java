package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书应用事件配置请求参数
 * @author Shawn Deng
 * @date 2022-01-11 19:00:52
 */
@ApiModel("飞书应用事件配置请求参数")
@Data
public class FeishuAppEventConfigRo {

    @ApiModelProperty(value = "事件加密密钥", dataType = "String", example = "asdj123jl1")
    private String eventEncryptKey;

    @NotBlank
    @ApiModelProperty(value = "事件校验令牌", dataType = "String", example = "12h3khkjhass")
    private String eventVerificationToken;
}
