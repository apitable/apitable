package com.vikadata.api.modular.idaas.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * 用户在千帆玉符系统登录后完成后续操作
 * </p>
 * @author 刘斌华
 * @date 2022-05-25 10:56:50
 */
@ApiModel("用户在千帆玉符系统登录后完成后续操作")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasAuthCallbackRo {

    @ApiModelProperty("玉符 IDaaS 登录回调返回的 code")
    @NotBlank
    private String code;

    @ApiModelProperty("玉符 IDaaS 登录回调返回的 state")
    @NotBlank
    private String state;

}
