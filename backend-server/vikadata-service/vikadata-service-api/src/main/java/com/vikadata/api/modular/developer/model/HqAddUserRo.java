package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 总部命令添加用户参数
 * </p>
 *
 * @author Kelly Chen
 * @date 2020/5/27 15:20
 */
@Data
@ApiModel("总部命令添加用户参数")
public class HqAddUserRo {

    @NotBlank
    @ApiModelProperty(value = "账号名", required = true, position = 2)
    private String username;

    private String phone;

    @NotBlank
    @ApiModelProperty(value = "密码", required = true, position = 3)
    private String password;
}
