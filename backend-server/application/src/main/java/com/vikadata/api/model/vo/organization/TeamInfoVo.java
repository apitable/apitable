package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * Department information
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Department information")
public class TeamInfoVo {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", example = "R&D Department", position = 2)
    private String teamName;

    @ApiModelProperty(value = "Parent ID, 0 if the parent is root", dataType = "java.lang.String", example = "0", position = 3)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long parentId;

    @ApiModelProperty(value = "Parent department name", example = "Scientific Research Center", position = 3)
    private String parentTeamName;

    @ApiModelProperty(value = "Number of department members", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Number of activated department members", example = "3", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer activateMemberCount;

    @ApiModelProperty(value = "Sort No", example = "1", position = 6)
    private Integer sequence;

    @ApiModelProperty(value = "Whether there are sub departments", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;
}
