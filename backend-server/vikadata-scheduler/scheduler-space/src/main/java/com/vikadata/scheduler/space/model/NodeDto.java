package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 节点dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
@Data
public class NodeDto {

    /**
     * 节点ID
     */
    private String nodeId;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 创建者
     */
    private Long createdBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 修改时间
     */
    private LocalDateTime updatedAt;
}
