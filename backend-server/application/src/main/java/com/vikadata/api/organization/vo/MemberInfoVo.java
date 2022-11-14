package com.vikadata.api.organization.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.organization.model.MemberTeamPathInfo;
import com.vikadata.api.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.MobilePhoneHideSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Member Details View
 * </p>
 */
@Data
@ApiModel("Member Details View")
public class MemberInfoVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait address", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "User nickname", example = "This is a user nickname", position = 2)
    private String nickName;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Job No", example = "000101", position = 3)
    private String jobNumber;

    @ApiModelProperty(value = "Position", example = "Manager", position = 4)
    private String position;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = MobilePhoneHideSerializer.class)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department", position = 7)
    private List<TeamVo> teams;

    @ApiModelProperty(value = "Label", position = 8)
    private List<TagVo> tags;

    @ApiModelProperty(value = "role", position = 8)
    private List<RoleVo> roles;

    @ApiModelProperty(value = "Administrator or not", example = "true", position = 5)
    private Boolean isAdmin;

    @ApiModelProperty(value = "Primary administrator or not", example = "true", position = 5)
    private Boolean isMainAdmin;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 5)
    private Boolean isActive;

    @ApiModelProperty(value = "Creat time", example = "2020-03-18T15:29:59.000", position = 9)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Update time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "Creat time", example = "2020-03-18T15:29:59.000", position = 9)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Update time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 11)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 12)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 13)
    private List<MemberTeamPathInfo> teamData;
}
