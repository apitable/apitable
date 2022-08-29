package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 空间管理 - 工作台设置 请求参数
 * </p>
 *
 * 状态字段与读库序列化对象保持一致
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 * @author Chambers
 * @date 2021/4/8
 */
@Data
@ApiModel("空间管理 - 工作台设置 请求参数")
public class SpaceWorkbenchSettingRo {

    @ApiModelProperty(value = "节点全员可导出状态", example = "true", position = 1)
    private Boolean nodeExportable;

    @ApiModelProperty(value = "全局水印开启状态", example = "true", position = 1)
    private Boolean watermarkEnable;
}
