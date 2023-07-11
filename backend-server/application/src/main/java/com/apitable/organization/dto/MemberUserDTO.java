package com.apitable.organization.dto;

import lombok.Data;

/**
 * Unit Member user DTO.
 */
@Data
public class MemberUserDTO {
    private Long id;

    private Long userId;

    private String memberName;

    private Boolean isActive;

    private Boolean isAdmin;
}
