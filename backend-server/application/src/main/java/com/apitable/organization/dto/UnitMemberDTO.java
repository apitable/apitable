package com.apitable.organization.dto;

import com.apitable.organization.enums.MemberType;
import lombok.Builder;
import lombok.Data;

/**
 * Unit Member DTO.
 */
@Data
@Builder(toBuilder = true)
public class UnitMemberDTO {
    /**
     * member's id.
     */
    private Long id;

    private String unitId;

    private String memberName;


    private String avatar;

    private String email;

    private String code;

    private String mobilePhone;

    private Integer status;

    private MemberType type;
}
