package com.vikadata.api.modular.workspace.model;

import lombok.Data;

/**
 * <p>
 * 权限控制单元角色信息
 * </p>
 *
 * @author Chambers
 * @date 2021/5/25
 */
@Data
public class ControlRoleInfo {

    private String controlId;

    private Long unitId;

    private String role;
}
