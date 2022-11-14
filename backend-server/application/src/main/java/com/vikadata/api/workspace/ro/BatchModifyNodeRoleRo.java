package com.vikadata.api.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * Batch Modify Node Role Request Parameters
 * </p>
 */
@Data
@ApiModel("Batch Modify Org Unit Role Request Parameters")
public class BatchModifyNodeRoleRo {

	@NotBlank(message = "Node ID cannot be empty")
	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
	private String nodeId;

	@NotEmpty(message = "Organization unit cannot be empty")
	@ApiModelProperty(value = "Org Unit ID Set", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> unitIds;

	@ApiModelProperty(value = "Role", example = "readonly", position = 3, required = true)
	@NotBlank(message = "Role cannot be empty")
	private String role;
}
