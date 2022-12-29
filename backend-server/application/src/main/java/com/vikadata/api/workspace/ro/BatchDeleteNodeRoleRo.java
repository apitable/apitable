package com.vikadata.api.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * Batch Delete Node Role Request Parameters
 * </p>
 */
@Data
@ApiModel("Batch Delete Node Role Request Parameters")
public class BatchDeleteNodeRoleRo {

	@ApiModelProperty(value = "The node ID is not passed to represent the root node, that is, the working directory", example = "nod10", position = 1)
	private String nodeId;

    @NotEmpty(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID Set", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;
}
