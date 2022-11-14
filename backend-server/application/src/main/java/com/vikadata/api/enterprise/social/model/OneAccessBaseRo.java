package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel("Huawei OneAccess Creation Information")
public class OneAccessBaseRo {

    @ApiModelProperty(value = "The request ID sent by the One Access platform each time the interface is called")
    private String bimRequestId;

    @ApiModelProperty(value = "The authorized account for the platform to call the third-party application interface")
    @NotBlank(message = "bimRemoteUser Can not be empty")
    private String bimRemoteUser;

    @ApiModelProperty(value = "The password for the platform to call the third-party application interface")
    @NotBlank(message = "bimRemotePwd Can not be empty")
    private String bimRemotePwd;

    @ApiModelProperty(value = "request data signature")
    private String signature;

}
