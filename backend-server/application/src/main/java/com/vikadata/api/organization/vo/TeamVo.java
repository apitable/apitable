package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Department View
 * </p>
 */
@Data
@ApiModel("Department View")
public class TeamVo {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", example = "R&D Department", position = 2)
    private String teamName;

    public TeamVo() {}

    public TeamVo(Long teamId, String teamName) {
        this.teamId = teamId;
        this.teamName = teamName;
    }
}
