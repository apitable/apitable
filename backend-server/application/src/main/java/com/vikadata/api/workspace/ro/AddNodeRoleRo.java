package com.vikadata.api.workspace.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * Add node role request parameters
 * </p>
 */
@Data
@ApiModel("Add node role request parameters")
public class AddNodeRoleRo {

	@NotBlank(message = "Node ID cannot be empty")
	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
	private String nodeId;

	@NotEmpty(message = "Organization unit cannot be empty")
	@ApiModelProperty(value = "Organization Unit ID Collection", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", required = true, position = 2)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> unitIds;

	@ApiModelProperty(value = "Role", example = "editor", position = 3, required = true)
	@NotBlank(message = "Role cannot be empty")
	private String role;
}
