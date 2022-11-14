package com.vikadata.api.workspace.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Delete node role request parameters
 * </p>
 */
@Data
@ApiModel("Delete node role request parameters")
public class DeleteNodeRoleRo {

	@ApiModelProperty(value = "The node ID is not passed to represent the root node, that is, the working directory", example = "nod10", position = 1)
	private String nodeId;

	@NotNull(message = "Organization unit cannot be empty")
	@ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "71638172638", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long unitId;
}
