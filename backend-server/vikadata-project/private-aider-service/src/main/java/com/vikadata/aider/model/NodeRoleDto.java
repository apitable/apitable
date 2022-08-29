package com.vikadata.aider.model;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p>
 * NodeRoleDto
 * </p>
 *
 * @author Chambers
 * @date 2021/5/26
 */
@Data
public class NodeRoleDto {

    private String spaceId;

    private String nodeId;

    private Long createdBy;

    private LocalDateTime createdAt;
}
