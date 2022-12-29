package com.vikadata.api.organization.dto;

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

