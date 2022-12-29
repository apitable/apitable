package com.vikadata.api.workspace.ro;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * DataSheet field role deletion request parameter
 * </p>
 */
@Data
@ApiModel("DataSheet field role deletion request parameter")
public class FieldRoleDeleteRo {

    @NotNull(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;
}
