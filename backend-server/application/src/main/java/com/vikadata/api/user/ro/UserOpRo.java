package com.vikadata.api.user.ro;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * User Action Request Parameters
 */
@Data
@ApiModel("User Action Request Parameters")
public class UserOpRo {

    @ApiModelProperty(value = "Avatar", example = "https://...", position = 4)
    private String avatar;

    @ApiModelProperty(value = "Nickname", example = "This is a nickname", position = 5)
    @Size(max = 32, message = "Nickname length cannot exceed 32 bits")
    private String nickName;

    @ApiModelProperty(value = "Whether it is a registered initialization nickname", example = "true", position = 5)
    private Boolean init;

    @ApiModelProperty(value = "Language", example = "zh-CN", position = 6)
    private String locale;
}
