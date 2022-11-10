package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Search Department Results View
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Search Department Results View")
public class SearchTeamResultVo {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", example = "Technical team", position = 2)
    private String teamName;

    @ApiModelProperty(value = "Department name (not highlighted)", example = "Technical team", position = 2)
    private String originName;

    @ApiModelProperty(value = "Parent Name", example = "R&D Department", position = 3)
    private String parentName;

    @ApiModelProperty(value = "Abbreviation", example = "Technology", position = 4)
    private String shortName;

    @ApiModelProperty(value = "Number of department members", example = "3", position = 4)
    private Integer memberCount;

    @ApiModelProperty(value = "Whether there are sub departments", example = "true", position = 6)
    private Boolean hasChildren;
}
