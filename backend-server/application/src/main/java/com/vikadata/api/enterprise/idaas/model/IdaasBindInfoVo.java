package com.vikadata.api.enterprise.idaas.model;

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
 * Get IDaaS information bound to the space station
 * </p>
 */
@ApiModel("Get IDaaS information bound to the space station")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class IdaasBindInfoVo {

    @ApiModelProperty("Whether IDaaS application is bound")
    private Boolean enabled;

    @ApiModelProperty("Bound IDaaS application Client ID")
    private String clientId;

    @Tolerate
    public IdaasBindInfoVo() {
        // default constructor
    }

}
