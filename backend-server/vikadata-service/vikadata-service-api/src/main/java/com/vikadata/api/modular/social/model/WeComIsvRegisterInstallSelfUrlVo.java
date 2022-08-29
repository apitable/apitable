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
 * 获取安装维格表的授权链接
 * </p>
 * @author 刘斌华
 * @date 2022-03-15 09:30:07
 */
@ApiModel("获取安装维格表的授权链接")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallSelfUrlVo {

    @ApiModelProperty(value = "授权链接", required = true)
    private String url;

    @ApiModelProperty(value = "授权链接中的随机状态码", required = true)
    private String state;

}
