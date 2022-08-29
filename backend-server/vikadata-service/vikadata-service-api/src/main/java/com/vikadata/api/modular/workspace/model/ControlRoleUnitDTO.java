package com.vikadata.api.modular.workspace.model;

import lombok.Data;

/**
 * <p>
 * 节点的角色对应组织单元视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/6 11:21
 */
@Data
public class ControlRoleUnitDTO {

    private Long unitId;

    private Integer unitType;

    private Long unitRefId;

    private String role;
}
