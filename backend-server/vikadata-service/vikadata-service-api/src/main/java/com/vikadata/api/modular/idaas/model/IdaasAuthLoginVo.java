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
 * Jump to IDaaS system for login
 * </p>
 */
@ApiModel("IDaaS binds the application under the tenant")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasAuthLoginVo {

    @ApiModelProperty("Login address")
    private String loginUrl;

    @Tolerate
    public IdaasAuthLoginVo() {
        // default constructor
    }

}
