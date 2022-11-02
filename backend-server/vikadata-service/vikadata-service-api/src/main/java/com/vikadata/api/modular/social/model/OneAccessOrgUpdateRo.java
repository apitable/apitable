package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess Update Organization Ro
 */
@Data
@ApiModel("OneAccess Update Organization Ro")
public class OneAccessOrgUpdateRo extends OneAccessBaseRo {

    @ApiModelProperty(value = "organization id", example = "1011")
    @NotBlank(message = "Organization id is not allowed to be empty")
    private String bimOrgId;

    @ApiModelProperty(value = "External Organization Id", example = "p-1011")
    @NotBlank(message = "External organization Id is not allowed to be empty")
    private String orgId;

    @ApiModelProperty(value = "department name", example = "xx-part")
    @NotBlank(message = "department name")
    private String orgName;

    @ApiModelProperty(value = "Parent organization id", example = "1000", position = 6)
    private String parentOrgId;

    @ApiModelProperty(value = "Whether to enable", example = "true")
    private boolean __ENABLE__ = true;

}
