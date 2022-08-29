package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p>
 * 第三方租户绑定部门DTO
 * </p>
 *
 * @author Pengap
 * @date 2021/9/6 15:19:46
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
     * unit_team 排序
     */
    private Integer internalSequence;

}
