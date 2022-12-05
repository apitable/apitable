package com.vikadata.api.organization.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Search Member Results View
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Search Member Results View")
public class SearchMemberResultVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Member name (not highlighted)", example = "Zhang San", position = 2)
    private String originName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait", example = "https://...", position = 3)
    private String avatar;

    @ApiModelProperty(value = "Department", example = "Technical team", position = 4)
    private String team;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 6)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "member is active", position = 7)
    private Boolean isActive;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 8)
    private List<MemberTeamPathInfo> teamData;

}
