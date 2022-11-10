package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Node Description Request Parameters
 * </p>
 */
@Data
@ApiModel("Node Description Request Parameters")
public class NodeDescOpRo {

	@NotBlank(message = "Node ID cannot be empty")
	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
	private String nodeId;

	@Length(max = 65535, message = "Description length exceeds the upper limit")
	@ApiModelProperty(value = "Node Description", example = "This is a node description", position = 2)
	private String description;
}
