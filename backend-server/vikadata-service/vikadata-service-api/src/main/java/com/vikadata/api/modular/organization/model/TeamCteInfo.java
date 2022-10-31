package com.vikadata.api.modular.organization.model;

import lombok.Data;

@Data
public class TeamCteInfo {

    /**
     * team id
     */
    private Long id;

    /**
     * parent team id
     */
    private Long parentId;
}

