package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Node Dto
 * </p>
 */
@Data
public class NodeDto {

    private String nodeId;

    private String spaceId;

    private Long createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
