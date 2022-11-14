package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * <p>
 * Third party tenant binds department DTO
 * </p>
 */
@Data
public class TenantDepartmentBindDTO {

    private Long id;

    private String departmentName;

    private String departmentId;

    private String parentDepartmentId;

    private String openDepartmentId;

    private String parentOpenDepartmentId;

    private Long teamId;

    private Long parentTeamId;

    /**
     * unit_team Sort
     */
    private Integer internalSequence;

}
