package com.vikadata.api.template.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * <p>
 * Create Template Request Parameters
 * </p>
 */
@Data
@ApiModel("Create Template Request Parameters")
public class CreateTemplateRo {

    @ApiModelProperty(value = "Template Name", example = "This is a template", position = 1, required = true)
    @NotBlank(message = "Template name cannot be empty")
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String name;

    @ApiModelProperty(value = "Node Id of template creation", example = "nod10", position = 2, required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Whether to retain data", example = "true", position = 3)
    private Boolean data = true;
}
