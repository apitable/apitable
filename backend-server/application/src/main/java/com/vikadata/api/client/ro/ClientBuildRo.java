package com.vikadata.api.client.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Add the client release version request parameter
 * </p>
 */
@Data
@ApiModel("Add the client release version request parameter")
public class ClientBuildRo {

    @NotBlank(message = "The version number cannot be empty")
    @ApiModelProperty(value = "Version No", dataType = "java.lang.String", example = "aaaa", required = true)
    private String version;

    @NotBlank(message = "The html content after base64Encode cannot be empty")
    @ApiModelProperty(value = "Html content", dataType = "java.lang.String", required = true, example = "aaaaadd")
    private String htmlContent;

    @ApiModelProperty(value = "Version Description", dataType = "java.lang.String", required = true, example = "构建")
    private String description;

    @NotBlank(message = "The publishing user cannot be empty")
    @ApiModelProperty(value = "Publishing user", dataType = "java.lang.String", required = true, example = "zhengxu@vikadta.com")
    private String publishUser;
}
