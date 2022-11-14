package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Adjust member department request parameters
 */
@Data
@ApiModel("Adjust member department request parameters")
public class UpdateMemberTeamRo {

    @NotEmpty
    @ApiModelProperty(value = "Member ID", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 1)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberIds;

    @ApiModelProperty(value = "The original department ID list can be blank. If it is blank, it means the root department", dataType = "java.lang.String", example = "271632", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long preTeamId;

    @NotEmpty
    @ApiModelProperty(value = "Adjusted Department ID List", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 3)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> newTeamIds;
}
