package com.vikadata.aider.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NodeRoleInfo {

    private Long id;

    private String roleCode;

    private LocalDateTime updatedAt;
}
