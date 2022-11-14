package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * OneAccess Create object vo
 */
@ApiModel("OneAccess Create vo")
public class OneAccessCreateVo extends OneAccessBaseVo {

    @ApiModelProperty(value = "The globally unique ID formed after the system account is created")
    @Setter
    @Getter
    private String uid;

    public OneAccessCreateVo(String bimRequestId) {
        super(bimRequestId);
    }

}
