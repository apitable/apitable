package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess User Creation Ro
 */
@Data
@ApiModel("OneAccess User Creation Ro")
public class OneAccessUserCreateRo {

    @ApiModelProperty(value = "The request ID sent by the platform each time the interface is called", position = 1)
    private String bimRequestId;

    @ApiModelProperty(value = "The authorized account for the platform to call the third-party application interface", position = 2)
    @NotBlank(message = "bimRemoteUser can not be empty")
    private String bimRemoteUser;

    @ApiModelProperty(value = "The password for the platform to call the third-party application interface", position = 3)
    @NotBlank(message = "bimRemotePwd can not be empty")
    private String bimRemotePwd;

    @ApiModelProperty(value = "Account Field Properties", position = 4)
    @NotBlank(message = "Account cannot be empty")
    private String loginName;

    @ApiModelProperty(value = "cellphone number", example = "13800000000", position = 5)
    @NotBlank(message = "Phone number can not be blank")
    private String mobile;

    @ApiModelProperty(value = "E-mail account", example = "test001@vikatest.com", position = 6)
    private String email;

    @ApiModelProperty(value = "组织Id", example = "10001", position = 7)
    private String orgId;

    @ApiModelProperty(value = "OneId", example = "one-100001", position = 8)
    private String oneId;

    @ApiModelProperty(value = "Account full name (name)", example = "Zhang San")
    private String fullName;
}
