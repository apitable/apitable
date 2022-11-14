package com.vikadata.api.workspace.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Basic node information
 */
@Data
public class BaseNodeInfo {

	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
	protected String nodeId;

	@ApiModelProperty(value = "Node Name", example = "This is a node", position = 2)
	protected String nodeName;

    @ApiModelProperty(value = "Node Type 0-ROOT（Root node） 1-folder（Folder） 2-file（Datasheet）", example = "1", position = 3)
    private Integer type;
}
