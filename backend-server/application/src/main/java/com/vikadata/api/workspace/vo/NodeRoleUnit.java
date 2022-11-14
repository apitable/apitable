package com.vikadata.api.workspace.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.organization.model.MemberTeamPathInfo;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Organization unit of the node role
 * </p>
 */
@Data
@ApiModel("Organization unit of the node role")
public class NodeRoleUnit {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Organization Unit Name", example = "R&D Department ｜ Zhang San", position = 2)
    private String unitName;

    @ApiModelProperty(value = "Type: 1-Department, 2-Label, 3-Member", example = "1", position = 3)
    private Integer unitType;

    @ApiModelProperty(value = "The number of members of the department. It is returned when the type is department", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Head portrait, returned when the type is member", example = "http://www.vikadata.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Department, returned when the type is member", example = "Operation Department | Product Department | R&D Department", position = 6)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 7)
    private String role;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 8)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "memberId / teamId", example = "1", position = 9)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitRefId;
}
