package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 配置表RO
 * </p>
 *
 * @author Chambers
 * @date 2022/6/24
 */
@Data
@ApiModel("配置表请求参数")
public class ConfigDatasheetRo {

    @ApiModelProperty(value = "配置表ID", required = true, example = "dst11", position = 1)
    private String datasheetId;
}
