package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;

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
 * 通过安装维格表的授权链接完成应用安装
 * </p>
 * @author 刘斌华
 * @date 2022-03-15 18:30:45
 */
@ApiModel("通过安装维格表的授权链接完成应用安装")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallSelfAuthCodeRo {

    @ApiModelProperty(value = "临时授权码", required = true)
    @NotBlank
    private String authCode;

    @ApiModelProperty(value = "随机状态码", required = true)
    @NotBlank
    private String state;

}
