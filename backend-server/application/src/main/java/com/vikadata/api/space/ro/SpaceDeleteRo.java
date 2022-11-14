package com.vikadata.api.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.base.enums.ValidateType;

/**
 * <p>
 * Space deletion request parameters
 * </p>
 */
@Data
@ApiModel("Space deletion request parameters")
public class SpaceDeleteRo {

    @ApiModelProperty(value = "Check type", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "Phone/email verification code", example = "123456", position = 2)
    private String code;

}
