package com.vikadata.api.enterprise.wechat.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

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
