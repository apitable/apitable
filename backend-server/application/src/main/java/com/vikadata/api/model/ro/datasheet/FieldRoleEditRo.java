package com.vikadata.api.model.ro.datasheet;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.FieldRoleMatch;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * DataSheet field role editing request parameters
 * </p>
 */
@Data
@ApiModel("DataSheet field role editing request parameters")
public class FieldRoleEditRo {

    @NotNull(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;

    @NotBlank(message = "Role cannot be empty")
    @FieldRoleMatch
    @ApiModelProperty(value = "Role", example = "editor", required = true, position = 3)
    private String role;
}
