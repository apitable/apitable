package com.vikadata.api.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

@Data
@ApiModel("Batch data table field role deletion request parameter")
public class BatchFieldRoleDeleteRo {

    @NotEmpty(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID Set", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

}
