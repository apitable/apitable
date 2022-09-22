package com.vikadata.api.modular.organization.model;

import lombok.Data;

/**
 * 角色信息
 *
 * @author tao
 */
@Data
public class RoleInfoDTO {

    private Long id;

    private Long unitId;

    private String roleName;

    private Integer position;

}
