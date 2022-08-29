package com.vikadata.api.modular.organization.model;

import lombok.Data;

/**
 * 部门cte信息
 *
 * @author liuzijing
 * @date 2022/5/19
 */
@Data
public class TeamCteInfo {

    /**
     * 部门ID
     */
    private Long id;

    /**
     * 父级部门ID
     */
    private Long parentId;
}

