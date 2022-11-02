package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess user delete ro
 */
@Data
@ApiModel("OneAccess user delete ro")
public class OneAccessUserDeleteRo {

    @ApiModelProperty(value = "The request sent by the platform every time it calls the interface ID", position = 1)
    private String bimRequestId;

    @ApiModelProperty(value = "The authorized account for the platform to call the third-party application interface", position = 2)
    @NotBlank(message = "bimRemoteUser Can not be empty")
    private String bimRemoteUser;

    @ApiModelProperty(value = "The password for the platform to call the third-party application interface", position = 3)
    @NotBlank(message = "bimRemotePwd Can not be empty")
    private String bimRemotePwd;

    @ApiModelProperty(value = "bimUid")
    @NotBlank(message = "bimUid can not be empty")
    private String bimUid;
}
