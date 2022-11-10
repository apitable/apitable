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
 * DataSheet Field Role Creation Request Parameters
 * </p>
 */
@Data
@ApiModel("DataSheet Field Role Creation Request Parameters")
public class FieldRoleCreateRo {

    @NotEmpty(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Organization Unit ID Collection", dataType = "List", example = "10101,10102,10103,10104", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @NotBlank(message = "Role cannot be empty")
    @FieldRoleMatch
    @ApiModelProperty(value = "Role", example = "editor", required = true, position = 3)
    private String role;
}
