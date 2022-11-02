package com.vikadata.api.model.dto.organization;

import java.util.List;

import lombok.Data;

@Data
public class SearchMemberDto {

	private Long unitId;

    private Long memberId;

    private String memberName;

    private String avatar;

    private Boolean isActive;

    private List<MemberTeamDto> team;

    private Boolean isNickNameModified;

    private Boolean isMemberNameModified;
}
