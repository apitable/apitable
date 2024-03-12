package com.apitable.organization.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Unit base info dto.
 */
@Data
@Builder(toBuilder = true)
public class UnitBaseInfoDTO {

    private String unitId;

    private Long unitRefId;

    private Long id;
}
