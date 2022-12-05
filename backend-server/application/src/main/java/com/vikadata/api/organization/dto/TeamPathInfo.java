package com.vikadata.api.organization.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * team path information
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TeamPathInfo extends TeamCteInfo {

    /**
     * team's name
     */
    private String teamName;

}