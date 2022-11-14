package com.vikadata.api.enterprise.gm.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Developer Information")
public class DevelopUserVo {

    @ApiModelProperty(value = "login user name", example = "XiaoMing", position = 1, required = true)
    private String userName;
}
