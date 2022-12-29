package com.vikadata.api.organization.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Member Company View
 * </p>
 */
@Data
@ApiModel("Member Company View")
public class UnitMemberVo {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "User ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "User UUID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member name (not highlighted)", example = "Zhang San", position = 3)
    private String originName;

    @ApiModelProperty(value = "Member Name", example = "R&D Department｜Zhang San", position = 3)
    private String memberName;

    @ApiModelProperty(value = "Member Email Address", example = "123456@vikadata.com", position = 4)
    private String email;

    @ApiModelProperty(value = "Member mobile number", example = "136****9061", position = 5)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar", example = "http://www.vikadata.com/image.png", position = 6)
    private String avatar;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 7)
    private Boolean isActive;

    @ApiModelProperty(value = "Member's Department", example = "Operation Department｜Product Department｜R&D Department", position = 8)
    private String teams;

    @ApiModelProperty(value = "Administrator or not", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 9)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 10)
    private List<MemberTeamPathInfo> teamData;

}
