package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * JS-SDK 校验企业身份与权限的配置参数
 * </p>
 * @author 刘斌华
 * @date 2022-03-09 11:48:35
 */
@ApiModel("JS-SDK 校验企业身份与权限的配置参数")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvJsSdkConfigVo {

    @ApiModelProperty(value = "当前登录微信企业的 corpId", required = true)
    private String authCorpId;

    @ApiModelProperty(value = "生成签名的时间戳", required = true)
    private Long timestamp;

    @ApiModelProperty(value = "生成签名的随机字符串", required = true)
    private String random;

    @ApiModelProperty(value = "生成的签名", required = true)
    private String signature;

}
