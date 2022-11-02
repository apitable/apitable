package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 节点基本信息
 *
 * @author Chambers
 * @since 2019/10/9
 */
@Data
public class BaseNodeInfo {

	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
	protected String nodeId;

	@ApiModelProperty(value = "节点名称", example = "这是一个节点", position = 2)
	protected String nodeName;

    @ApiModelProperty(value = "节点类型 0-ROOT（根节点） 1-folder（文件夹） 2-file（数表）", example = "1", position = 3)
    private Integer type;
}
