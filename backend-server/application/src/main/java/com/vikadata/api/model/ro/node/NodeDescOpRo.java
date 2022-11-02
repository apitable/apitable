package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 节点描述请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/3/18
 */
@Data
@ApiModel("节点描述请求参数")
public class NodeDescOpRo {

	@NotBlank(message = "节点ID不能为空")
	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
	private String nodeId;

	@Length(max = 65535, message = "描述长度超过上限")
	@ApiModelProperty(value = "节点描述", example = "这是一个节点描述", position = 2)
	private String description;
}
