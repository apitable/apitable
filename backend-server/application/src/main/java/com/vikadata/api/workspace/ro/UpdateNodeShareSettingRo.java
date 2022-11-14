package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Change node sharing setting request parameters
 * </p>
 */
@Data
@ApiModel("Change node sharing setting request parameters")
public class UpdateNodeShareSettingRo {

    @NotBlank(message = "Share setting parameter cannot be empty")
    @ApiModelProperty(value = "Share setting parameter string", dataType = "string", required = true, example = "\"{\"onlyRead\": true}\"")
    private String props;
}
