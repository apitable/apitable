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
 * 玉符 IDaaS 绑定租户下的应用
 * </p>
 * @author 刘斌华
 * @date 2022-05-19 10:28:21
 */
@ApiModel("玉符 IDaaS 绑定租户下的应用")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasAppBindRo {

    @ApiModelProperty(value = "租户名", required = true)
    @NotBlank
    private String tenantName;

    @ApiModelProperty(value = "应用的 Client ID", required = true)
    @NotBlank
    private String appClientId;

    @ApiModelProperty(value = "应用的 Client Secret", required = true)
    @NotBlank
    private String appClientSecret;

    @ApiModelProperty(value = "应用的 Well-known 接口路径", required = true)
    @NotBlank
    private String appWellKnown;

    @ApiModelProperty(value = "要绑定的空间站 ID", required = true)
    @NotBlank
    private String spaceId;

}
