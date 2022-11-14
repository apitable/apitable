package com.vikadata.api.space.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * Add administrator request parameters
 * </p>
 */
@Data
@ApiModel("Add administrator request parameters")
public class AddSpaceRoleRo {

    @NotEmpty(message = "The selected member list cannot be empty")
    @ApiModelProperty(value = "Member ID", dataType = "List", example = "[1,2]", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberIds;

    @NotEmpty(message = "Resource cannot be empty")
    @ApiModelProperty(value = "Operation resource set, no sorting, automatic verification", dataType = "List", required = true, example = "[\"MANAGE_TEAM\",\"MANAGE_MEMBER\"]", position = 2)
    private List<String> resourceCodes;
}
