package com.vikadata.api.model.ro.config;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *     Template Center Related Configuration Request Parameters
 * </p>
 */
@Data
@ApiModel("Template Center Related Configuration Request Parameters")
public class TemplateConfigRo {

    @ApiModelProperty(value = "Type: 1. Popular recommendation; 2. Shelf formwork", example = "1", position = 1, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @ApiModelProperty(value = "Node ID", example = "dstxxx", position = 2, required = true)
    @NotNull(message = "The configuration table cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Node View ID", example = "viwxxx", position = 3, required = true)
    @NotNull(message = "Configuration view cannot be empty")
    private String nodeView;

    @ApiModelProperty(value = "Language", example = "zh_CN", position = 4, required = true)
    @NotNull(message = "Language cannot be empty")
    private String lang;

    @ApiModelProperty(value = "Listing template classification table id", example = "viwxxx", position = 5, required = true)
    private String categoryDatasheetId;

    @ApiModelProperty(value = "Node View ID", example = "viwxxx", position = 6, required = true)
    private String categoryDatasheetView;
}
