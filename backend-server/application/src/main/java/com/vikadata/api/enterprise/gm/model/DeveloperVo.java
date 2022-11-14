package com.vikadata.api.enterprise.gm.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Login Result Vo")
public class DeveloperVo {

    @ApiModelProperty(value = "The result of login verification", example = "ABBBAAAVCCC", position = 1)
    private boolean isVerified;

    @ApiModelProperty(value = "login user uuid", example = "123123123", position = 2)
    private String uuid;

    @ApiModelProperty(value = "login user name", example = "XiaoMing", position = 3)
    private String username;
}
