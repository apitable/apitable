package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Openapi小程序Vo视图
 * </p>
 *
 * @author Pengap
 * @date 2022/5/6 11:36:30
 */
@Data
@ApiModel("Openapi小程序Vo视图")
public class WidgetInfoVo {

    @ApiModelProperty(value = "小程序名称")
    private String widgetName;

    @ApiModelProperty(value = "小程序描述")
    private String widgetDescription;

}
