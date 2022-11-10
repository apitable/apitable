package com.vikadata.api.model.vo.organization;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Page: member list view
 * </p>
 */
@Data
@ApiModel("Page: member list view")
public class MemberPageVo {

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

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Phone number", example = "13344445555", position = 3)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department ID", example = "1,2,3", position = 6)
    private String teamIds;

    @ApiModelProperty(value = "Department", example = "R&D Department | Operation Department | Design Department", position = 7)
    private String teams;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 8)
    private Boolean isActive;

    @ApiModelProperty(value = "Primary administrator or not", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isPrimary;

    @ApiModelProperty(value = "Sub administrator or not", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isSubAdmin;

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

    @ApiModelProperty(value = "team' id and full hierarchy team path name", position = 13)
    private List<MemberTeamPathInfo> teamData;
}
