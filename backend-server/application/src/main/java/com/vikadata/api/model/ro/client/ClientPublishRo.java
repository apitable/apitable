package com.vikadata.api.model.ro.client;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
* <p>
* Client Update Version
* </p>
*/
@Data
@ApiModel("Datasheet updated version")
public class ClientPublishRo {

    @NotBlank(message = "Version No")
    @ApiModelProperty(value = "Version No", dataType = "java.lang.String", example = "aaaa", required = true)
    private String version;
}
