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
 * IDaaS Create tenant
 * </p>
 */
@ApiModel("IDaaS Create tenant")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasTenantCreateVo {

    /**
     * Primary key ID
     */
    @ApiModelProperty("Primary key ID")
    private Long id;

    /**
     * tenant ID
     */
    @ApiModelProperty("tenant ID")
    private String tenantId;

    /**
     * tenant name
     */
    @ApiModelProperty("tenant name")
    private String tenantName;

    @Tolerate
    public IdaasTenantCreateVo() {
        // default constructor
    }

}
