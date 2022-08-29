package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 节点复制请求参数
 *
 * @author Chambers
 * @since 2019/11/01
 */
@Data
@ApiModel("节点复制请求参数")
public class NodeCopyOpRo {

    @ApiModelProperty(value = "节点Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "节点Id不能为空")
    private String nodeId;

    @ApiModelProperty(value = "是否需要复制数据", example = "true", position = 4)
    private Boolean data;
}
