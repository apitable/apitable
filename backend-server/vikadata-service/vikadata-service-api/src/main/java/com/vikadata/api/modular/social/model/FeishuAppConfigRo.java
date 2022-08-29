package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书自建应用生成回调地址请求参数
 * @author Shawn Deng
 * @date 2022-01-11 19:00:52
 */
@ApiModel("飞书应用基础配置请求参数")
@Data
public class FeishuAppConfigRo {

    @ApiModelProperty(value = "应用ID", dataType = "String", example = "123456", position = 1)
    private String appKey;

    @ApiModelProperty(value = "应用密钥", dataType = "String", example = "1", position = 1)
    private String appSecret;
}
