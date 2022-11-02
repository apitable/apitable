package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess Create organization ro
 */
@Data
@ApiModel("OneAccess Create organization ro")
public class OneAccessOrgCreateRo extends OneAccessBaseRo {

    @ApiModelProperty(value = "Current Organization Id", example = "100001")
    @NotBlank(message = "organization Id")
    private String orgId;

    @ApiModelProperty(value = "organization name", example = "xxx-depart")
    @NotBlank(message = "organization name")
    private String orgName;

    @ApiModelProperty(value = "parent organization id", example = "10001", position = 6)
    private String parentOrgId;

}
