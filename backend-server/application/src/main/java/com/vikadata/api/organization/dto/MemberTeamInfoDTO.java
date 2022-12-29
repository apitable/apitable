package com.vikadata.api.organization.dto;

import lombok.Data;

/**
 * memberId and member's teamId DTO
 */
@Data
public class MemberTeamInfoDTO {

    /**
     * member's id
     */
    private Long memberId;

    /**
     * team's id
     */
    private Long teamId;

}