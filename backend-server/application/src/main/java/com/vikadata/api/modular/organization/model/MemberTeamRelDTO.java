package com.vikadata.api.modular.organization.model;

import java.util.List;

import lombok.Data;

import com.vikadata.api.model.dto.organization.MemberTeamDto;

@Data
public class MemberTeamRelDTO {


    private Long memberId;

    private List<MemberTeamDto> teams;

}
