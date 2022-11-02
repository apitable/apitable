package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Lark Application event configuration request parameters
 */
@ApiModel("Lark Application event configuration request parameters")
@Data
public class FeishuAppEventConfigRo {

    @ApiModelProperty(value = "Event Encryption Key", dataType = "String", example = "asdj123jl1")
    private String eventEncryptKey;

    @NotBlank
    @ApiModelProperty(value = "Event verification token", dataType = "String", example = "12h3khkjhass")
    private String eventVerificationToken;
}
