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
 * IDaaS Bind the application under the tenant
 * </p>
 */
@ApiModel("IDaaS Bind the application under the tenant")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasAppBindRo {

    @ApiModelProperty(value = "tenant name", required = true)
    @NotBlank
    private String tenantName;

    @ApiModelProperty(value = "application's client ID", required = true)
    @NotBlank
    private String appClientId;

    @ApiModelProperty(value = "application's client secret", required = true)
    @NotBlank
    private String appClientSecret;

    @ApiModelProperty(value = "application's Well-known interface path", required = true)
    @NotBlank
    private String appWellKnown;

    @ApiModelProperty(value = "bind space ID", required = true)
    @NotBlank
    private String spaceId;

}
