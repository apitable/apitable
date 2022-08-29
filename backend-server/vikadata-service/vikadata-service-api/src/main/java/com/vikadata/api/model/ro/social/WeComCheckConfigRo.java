package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企业微信检查应用绑定配置请求参数
 * </p>
 * @author Pengap
 * @date 2021/7/28 16:28:24
 */
@Data
@ApiModel("企业微信检查应用绑定配置请求参数")
public class WeComCheckConfigRo {

    @NotBlank
    @ApiModelProperty(value = "企业Id", required = true, position = 1)
    private String corpId;

    @NotNull
    @ApiModelProperty(value = "自建应用Id", required = true, position = 2)
    private Integer agentId;

    @NotBlank
    @ApiModelProperty(value = "自建应用密钥", required = true, position = 3)
    private String agentSecret;

}
