package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.FieldRoleMatch;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * Batch data table field role editing request parameters
 * </p>
 */
@Data
@ApiModel("Batch data table field role editing request parameters")
public class BatchFieldRoleEditRo {

    @NotEmpty(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID Set", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @NotBlank(message = "Role cannot be empty")
    @FieldRoleMatch
    @ApiModelProperty(value = "Role", example = "editor", required = true, position = 3)
    private String role;
}
