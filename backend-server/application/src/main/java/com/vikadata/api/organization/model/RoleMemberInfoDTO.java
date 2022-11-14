package com.vikadata.api.organization.model;

import lombok.Data;

@Data
public class RoleMemberInfoDTO {

    private Long roleId;

    private Long unitId;

    private Long unitRefId;

    private Integer unitType;

}
