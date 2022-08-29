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
 * 获取注册企微并安装维格表的注册码
 * </p>
 * @author 刘斌华
 * @date 2022-03-14 17:46:07
 */
@ApiModel("获取注册企微并安装维格表的注册码")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallWeComVo {

    @ApiModelProperty(value = "注册码", required = true)
    private String registerCode;

}
