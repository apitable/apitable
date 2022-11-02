package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序创建的请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@Data
@ApiModel("小程序创建的请求参数")
public class WidgetCreateRo {

    @ApiModelProperty(value = "数表、仪表盘或镜像的节点ID", required = true, example = "dstAAA/dsbBBB", position = 1)
    @NotBlank(message = "节点ID 不能为空")
    private String nodeId;

    @ApiModelProperty(value = "小程序包ID", required = true, example = "wpkBBB", position = 2)
    @NotBlank(message = "小程序包ID 不能为空")
    private String widgetPackageId;

    @ApiModelProperty(value = "小程序名称", example = "这是一个小程序", position = 3)
    private String name = "新建小程序";
}
