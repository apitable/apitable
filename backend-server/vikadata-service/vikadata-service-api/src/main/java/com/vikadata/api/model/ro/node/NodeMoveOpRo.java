package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 节点移动请求参数
 *
 * @author Chambers
 * @since 2019/11/01
 */
@Data
@ApiModel("节点移动请求参数")
public class NodeMoveOpRo {

    @ApiModelProperty(value = "节点Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "节点Id不能为空")
    private String nodeId;

    @ApiModelProperty(value = "目标位置的父类节点Id", example = "nod10", position = 2, required = true)
	@NotBlank(message = "父类节点Id不能为空")
    private String parentId;

    @ApiModelProperty(value = "目标位置的前一个节点，为空时即移动到了首位", example = "nod10", position = 3)
    private String preNodeId;
}
