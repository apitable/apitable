package com.vikadata.api.modular.organization.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

/**
 * member's teamId and team full hierarchy path name
 */
@Data
public class MemberTeamPathInfo {

    /**
     * team's id
     */
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    /**
     * team's full hierarchy path name
     */
    private String fullHierarchyTeamName;
}