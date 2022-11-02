package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 节点路径视图
 * </p>
 *
 * @author Chambers
 * @date 2020/1/17
 */
@Data
@ApiModel("节点路径视图")
public class NodePathVo {

	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
    private String nodeId;

	@ApiModelProperty(value = "节点名称", example = "这是一个节点", position = 2)
	private String nodeName;
}
