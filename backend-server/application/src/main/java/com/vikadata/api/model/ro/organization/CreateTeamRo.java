package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * <p>
 * New department request parameter
 * </p>
 */
@Data
@ApiModel("New department request parameter")
public class CreateTeamRo {

    @NotBlank
    @Size(min = 1, max = 100, message = "Department name cannot exceed 100 characters")
    @ApiModelProperty(value = "Department name", required = true, example = "Finance Department", position = 1)
    private String name;

    @NotNull
    @ApiModelProperty(value = "Parent ID, 0 if the parent is root", dataType = "java.lang.String", example = "0", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long superId;
}
