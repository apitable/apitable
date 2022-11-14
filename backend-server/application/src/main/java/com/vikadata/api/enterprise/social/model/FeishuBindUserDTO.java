package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Bind user request parameters
 */
@Data
@ApiModel("Lark Bind user request parameters")
public class FeishuBindUserDTO {

    @ApiModelProperty(value = "Area code", example = "+86")
    @NotBlank(message = "The region of the mobile phone number cannot be empty")
    private String areaCode;

    @ApiModelProperty(value = "Phone number", example = "13800000000")
    @NotBlank(message = "Mobile number cannot be empty")
    private String mobile;

    @ApiModelProperty(value = "Mobile phone verification code", example = "123456")
    @NotBlank(message = "Mobile phone verification code cannot be empty")
    private String code;

    @ApiModelProperty(value = "Lark The user's unique ID in the application", example = "ou_6364101b36f45b594e8aa55edafe52de")
    @NotBlank(message = "Enterprise user ID cannot be empty")
    private String openId;

    @ApiModelProperty(value = "Lark The user's unique ID in the application", example = "ou_6364101b36f45b594e8aa55edafe52de")
    @NotBlank(message = "Enterprise ID cannot be empty")
    private String tenantKey;
}
