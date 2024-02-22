package com.apitable.organization.dto;

import lombok.Data;

/**
 * Unit Member Team DTO.
 */
@Data
public class UnitMemberTeamDTO {
    /**
     * member's id.
     */
    private Long memberId;

    private Long userId;

    private Long unitId;

    private String avatar;

    private Integer avatarColor;

    private String memberName;
    /**
     * used for cp isv user.
     */
    private String openId;

    private String teamName;

    private Boolean isDeleted;
}
