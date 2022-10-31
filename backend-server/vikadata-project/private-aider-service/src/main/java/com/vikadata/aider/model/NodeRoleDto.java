package com.vikadata.aider.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NodeRoleDto {

    private String spaceId;

    private String nodeId;

    private Long createdBy;

    private LocalDateTime createdAt;
}
