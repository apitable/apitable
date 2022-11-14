package com.vikadata.api.workspace.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel("Node Role Parameters")
public class NodeRoleRo {

    @NotNull(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Role", example = "readonly", position = 3, required = true)
    @NotBlank(message = "Role cannot be empty")
    private String role;
}
