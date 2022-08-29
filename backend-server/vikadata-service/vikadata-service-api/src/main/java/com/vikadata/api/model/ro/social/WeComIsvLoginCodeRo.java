package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
 * 企业微信内第三方应用授权登录
 * </p>
 * @author 刘斌华
 * @date 2022-01-20 15:56:19
 */
@ApiModel("企业微信应用用户登录请求参数")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvLoginCodeRo {

    @ApiModelProperty(value = "应用套件 ID", required = true)
    @NotBlank
    private String suiteId;

    @ApiModelProperty(value = "登录授权码", required = true)
    @NotBlank
    private String code;

}
