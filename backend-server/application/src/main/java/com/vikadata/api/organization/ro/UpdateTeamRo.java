package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Department Modification Request Parameters
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Modify department information request parameters")
public class UpdateTeamRo {

    @NotNull
    @ApiModelProperty(value = "Department ID", required = true, dataType = "java.lang.String", example = "1", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", dataType = "string", example = "Design Department", position = 2)
    private String teamName;

    @ApiModelProperty(value = "Parent ID, 0 if the parent is root", required = true, dataType = "java.lang.String", example = "0", position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long superId;
}
