package com.vikadata.api.space.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * <p>
 * Update administrator request parameters
 * </p>
 */
@ApiModel("Update administrator request parameters")
@Data
public class UpdateSpaceRoleRo {

	@NotNull(message = "ID cannot be empty")
	@ApiModelProperty(value = "Role ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long id;

	@NotNull(message = "The selected member cannot be empty")
	@ApiModelProperty(value = "Select Member ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@NotEmpty(message = "The assignment permission cannot be empty")
	@ApiModelProperty(value = "Operation resource set, no sorting, automatic verification", dataType = "List", required = true, example = "[\"MANAGE_TEAM\",\"MANAGE_MEMBER\"]", position = 2)
	private List<String> resourceCodes;
}
