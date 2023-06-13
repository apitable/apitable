package com.apitable.organization.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Unit Team DTO.
 */
@Data
@Builder(toBuilder = true)
public class UnitTeamDTO {
    /**
     * team's id.
     */
    private Long id;

    private String unitId;

    private String teamName;

    private Integer sequence;

    private String parentUnitId;
}
