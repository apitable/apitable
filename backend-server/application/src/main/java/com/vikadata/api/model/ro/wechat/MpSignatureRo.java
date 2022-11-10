package com.vikadata.api.model.ro.wechat;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Public ID signature request parameters
 * </p>
 */
@Data
@ApiModel("Public ID signature request parameters")
public class MpSignatureRo {

    @ApiModelProperty(value = "Route", dataType = "java.lang.String", example = "https://...", position = 1, required = true)
    @NotBlank(message = "The url cannot be empty")
    private String url;
}
