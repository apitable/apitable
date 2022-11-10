package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Account Association Request Parameters
 * </p>
 */
@Data
@ApiModel("Account Association Request Parameters")
public class UserLinkOpRo {

    @NotNull(message = "Third party type cannot be empty")
    @ApiModelProperty(value = "Third party type(0.DingTalk;1.WeChat;2.QQ)", example = "1", position = 1, required = true)
    private Integer type;
}
