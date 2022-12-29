package com.vikadata.api.organization.dto;

import java.util.List;

import lombok.Data;

@Data
public class MemberIsolatedInfo {

    /**
     * whether the member is isolated
     */
    private boolean isolated;

    /**
     * the member's team ids
     */
    private List<Long> teamIds;
}
