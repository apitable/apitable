package com.vikadata.api.base.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Configure request parameters
 * </p>
 */
@Data
@ApiModel("Configure request parameters")
public class ConfigRo {

    @ApiModelProperty(value = "Type: 1. Novice guidance announcement", example = "1", position = 1, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @ApiModelProperty(value = "Configuration content", example = "json", position = 2)
    private String content;

    @ApiModelProperty(value = "Rollback or not", example = "true", position = 3)
    private Boolean rollback;

    @ApiModelProperty(value = "Language", example = "zh-CN", position = 4)
    private String lang = "zh_CN";
}
