package com.vikadata.api.modular.organization.model;

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