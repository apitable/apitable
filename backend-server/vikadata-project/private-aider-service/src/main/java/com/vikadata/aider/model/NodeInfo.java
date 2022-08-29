package com.vikadata.aider.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * NodeInfo
 * <p>
 *
 * @author liuzijing
 * @date 2022/2/8 3:40 PM
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NodeInfo {

    private Long id;

    private String spaceId;

    private String parentId;

    private String nodeId;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
