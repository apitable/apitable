package com.vikadata.api.workspace.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * Modify node role request parameters
 * </p>
 */
@Data
@ApiModel("Modify Org Unit Role Request Parameters")
public class ModifyNodeRoleRo {

	@NotBlank(message = "Node ID cannot be empty")
	@ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
	private String nodeId;

	@NotNull(message = "Organization unit cannot be empty")
	@ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long unitId;

	@ApiModelProperty(value = "Role", example = "readonly", position = 3, required = true)
	@NotBlank(message = "Role cannot be empty")
	private String role;
}
