package com.apitable.organization.dto;

import lombok.Data;

/**
 * Role's member.
 */
@Data
public class RoleMemberDTO {

    private Long roleId;

    private Long unitRefId;

    private Integer unitType;
}
