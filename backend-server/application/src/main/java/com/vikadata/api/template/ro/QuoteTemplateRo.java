package com.vikadata.api.template.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Reference Template Request Parameters
 * </p>
 */
@Data
@ApiModel("Reference Template Request Parameters")
public class QuoteTemplateRo {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1, required = true)
    @NotBlank(message = "Template ID cannot be empty")
    private String templateId;

    @ApiModelProperty(value = "Parent node ID", example = "fodSf4PZBNwut", position = 2, required = true)
    private String parentId;

    @ApiModelProperty(value = "Whether to retain data", example = "true", position = 3)
    private Boolean data = true;
}
