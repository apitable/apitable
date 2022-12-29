package com.vikadata.api.workspace.dto;

import lombok.Data;

@Data
public class NodePermissionDTO {

    private String nodeId;

    private String role;

    private Long unitId;
}
