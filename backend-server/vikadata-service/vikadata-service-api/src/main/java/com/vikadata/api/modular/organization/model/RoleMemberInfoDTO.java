package com.vikadata.api.modular.organization.model;

import lombok.Data;

/**
 * 角色成员基础信息
 *
 * @author tao
 */
@Data
public class RoleMemberInfoDTO {

    private Long roleId;

    private Long unitId;

    private Long unitRefId;

    private Integer unitType;

}
