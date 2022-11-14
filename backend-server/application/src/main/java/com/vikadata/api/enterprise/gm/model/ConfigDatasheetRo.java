package com.vikadata.api.enterprise.gm.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Config Datesheet RO")
public class ConfigDatasheetRo {

    @ApiModelProperty(value = "Config datasheet id", required = true, example = "dst11", position = 1)
    private String datasheetId;
}
