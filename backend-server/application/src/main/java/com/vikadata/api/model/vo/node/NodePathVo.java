package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Node Path View
 * </p>
 */
@Data
@ApiModel("Node Path View")
public class NodePathVo {

	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
    private String nodeId;

	@ApiModelProperty(value = "Node Name", example = "This is a node", position = 2)
	private String nodeName;
}
