package com.vikadata.api.organization.dto;

import java.util.List;

import lombok.Data;

@Data
public class SearchMemberDTO {

	private Long unitId;

    private Long memberId;

    private String memberName;

    private String avatar;

    private Boolean isActive;

    private List<MemberTeamDTO> team;

    private Boolean isNickNameModified;

    private Boolean isMemberNameModified;
}
