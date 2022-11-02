package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Single widget release RO")
public class SingleGlobalWidgetRo {

    @NotBlank
    @ApiModelProperty(value = "the node id", hidden = true)
    private String nodeId;

    @NotBlank
    @ApiModelProperty(value = "the widget id")
    private String packageId;

    @ApiModelProperty(value = "Whether to take effect")
    private Boolean isEnabled;

    @ApiModelProperty(value = "Whether the template")
    private Boolean isTemplate;

    @ApiModelProperty(value = "template component source address")
    private String openSourceAddres;

    @ApiModelProperty(value = "template widget extension cover")
    private String templateCover;

    @ApiModelProperty(value = "official widget website")
    private String website;

    @NotBlank
    @ApiModelProperty(value = "record id", hidden = true)
    private String recordId;

}
