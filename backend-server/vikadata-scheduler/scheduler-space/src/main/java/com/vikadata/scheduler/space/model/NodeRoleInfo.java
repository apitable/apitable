package com.vikadata.scheduler.space.model;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p>
 * NodeRoleInfo
 * </p>
 *
 * @author Chambers
 * @date 2021/5/27
 */
@Data
public class NodeRoleInfo {

    private Long id;

    private String roleCode;

    private LocalDateTime updatedAt;
}
