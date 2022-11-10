package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Space public invitation link vo
 * </p>
 */
@Data
@ApiModel("Space public invitation link vo")
public class SpaceLinkVo {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Name of superior department", example = "R&D Department", position = 2)
    private String parentTeamName;

    @ApiModelProperty(value = "Department name", example = "Front end group", position = 3)
    private String teamName;

    @ApiModelProperty(value = "Invitation Token", example = "qwe31", position = 4)
    private String token;
}
