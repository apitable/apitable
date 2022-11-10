package com.vikadata.api.model.vo.organization;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Organization Unit Information View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Organization Unit Information View")
public class UnitInfoVo {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Classification: 1-department, 3-member", example = "1", position = 2)
    private Integer type;

    @ApiModelProperty(value = "Organization unit association ID (may be team ID or member ID according to the type)", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitRefId;

    @ApiModelProperty(value = "Department/Member Name", example = "R&D Department｜Zhang San", position = 3)
    private String name;

    @ApiModelProperty(value = "User ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @Deprecated
    @ApiModelProperty(value = "User UUID corresponding to the member", hidden = true)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member avatar", example = "http://www.vikadata.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Whether the member has been activated", example = "true", position = 6)
    private Boolean isActive;

    @ApiModelProperty(value = "Whether the organization unit is deleted", example = "false", position = 7)
    private Boolean isDeleted;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 9)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "email", example = "test@vikadata.com", position = 10)
    private String email;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 11)
    private List<MemberTeamPathInfo> teamData;

}
