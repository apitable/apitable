package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess User update ro
 */
@Data
@ApiModel("OneAccess User update ro")
public class OneAccessUserUpdateRo extends OneAccessBaseRo {

    @ApiModelProperty(value = "bimUid")
    @NotBlank(message = "bimUid can not be empty")
    private String bimUid;

    @ApiModelProperty(value = "Account Field Properties")
    @NotBlank(message = "Account cannot be empty")
    private String loginName;

    @ApiModelProperty(value = "mobile number", example = "13800000000")
    @NotBlank(message = "mobile number can not be blank")
    private String mobile;

    @ApiModelProperty(value = "E-mail account", example = "test001@vikatest.com")
    private String email;

    @ApiModelProperty(value = "OrganizationId", example = "1011")
    private String orgId;

    @ApiModelProperty(value = "Account full name (name)", example = "bob")
    private String fullName;
}
