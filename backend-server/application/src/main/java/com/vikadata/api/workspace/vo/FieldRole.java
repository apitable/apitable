package com.vikadata.api.workspace.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.organization.model.MemberTeamPathInfo;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

@Data
@ApiModel("Data Table Field Role View")
public class FieldRole {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Organization Unit Name", example = "R&D Department ｜ Zhang San", position = 2)
    private String unitName;

    @ApiModelProperty(value = "Type: 1-Department, 2-Label, 3-Member", example = "1", position = 3)
    private Integer unitType;

    @ApiModelProperty(value = "When an organization unit is a member, indicate whether it is an administrator", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @ApiModelProperty(value = "The number of members of the department. It is returned when the type is department", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Head portrait, returned when the type is member", example = "https://www.vikadata.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Department, returned when the type is member", example = "Operation Department | Product Department | R&D Department", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 7)
    private String role;

    @ApiModelProperty(value = "Mark whether it is the field authority owner (open)", example = "false", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isOwner;

    @Deprecated
    @ApiModelProperty(value = "Whether the role permission is invalid", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean roleInvalid;

    @Deprecated
    @ApiModelProperty(value = "Whether read-only permission can be set", example = "true", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canRead;

    @Deprecated
    @ApiModelProperty(value = "Whether editing permission can be set", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canEdit;

    @Deprecated
    @ApiModelProperty(value = "Whether permission can be removed", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canRemove;

    @Deprecated
    @ApiModelProperty(value = "Node manageable flag (space station administrator+node manageable organizational unit)", example = "true", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeManageable;

    @Deprecated
    @ApiModelProperty(value = "Permission inheritance flag", example = "true", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean permissionExtend;

    @ApiModelProperty(value = "memberId / teamId", dataType = "java.lang.String", example = "1", position = 14)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitRefId;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 15)
    private List<MemberTeamPathInfo> teamData;
}
