package com.vikadata.api.user.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.base.enums.ValidateType;

/**
 * <p>
 * Refresh developer access token request parameters
 * </p>
 */
@Data
@ApiModel("Refresh developer access token request parameters")
public class RefreshApiKeyRo {

    @ApiModelProperty(value = "Check type", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "Verification Code", example = "125484", position = 1)
    private String code;
}
