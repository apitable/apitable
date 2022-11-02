package com.vikadata.api.modular.idaas.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;

/**
 * <p>
 * IDaaS Bind the application under the tenant
 * </p>
 */
@ApiModel("IDaaS Bind the application under the tenant")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasAppBindVo {

    @ApiModelProperty("Single sign on URL")
    private String initiateLoginUri;

    @ApiModelProperty("Login callback URL")
    private String redirectUri;

    @Tolerate
    public IdaasAppBindVo() {
        // default constructor
    }

}
