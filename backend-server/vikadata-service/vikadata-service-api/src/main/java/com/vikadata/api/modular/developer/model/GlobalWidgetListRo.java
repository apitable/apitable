package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * GM 命令全局小组件列表请求参数
 * </p>
 * @author Pengap
 * @date 2021/9/29 18:55:41
 */
@Data
@ApiModel("全局小组件列表请求参数")
public class GlobalWidgetListRo {

    @ApiModelProperty(value = "节点Id", required = true, position = 1)
    @NotEmpty(message = "NodeId 不能为空")
    private String nodeId;

}
