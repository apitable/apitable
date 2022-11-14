package com.vikadata.api.organization.model;

import java.util.List;

import lombok.Data;

import com.vikadata.api.organization.dto.MemberTeamDTO;

@Data
public class MemberTeamRelDTO {


    private Long memberId;

    private List<MemberTeamDTO> teams;

}
