package com.vikadata.api.space.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Space public invitation link request parameters
 * </p>
 */
@Data
@ApiModel("Space public invitation link request parameters")
public class SpaceLinkOpRo {

    @NotNull(message = "Department ID cannot be empty")
    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1254", position = 1, required = true)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "nodeId", dataType = "java.lang.String", example = "dst***", position = 2)
    private String nodeId;
}
