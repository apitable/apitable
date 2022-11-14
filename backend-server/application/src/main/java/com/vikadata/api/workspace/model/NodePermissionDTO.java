package com.vikadata.api.workspace.model;

import lombok.Data;

@Data
public class NodePermissionDTO {

    private String nodeId;

    private String role;

    private Long unitId;
}
