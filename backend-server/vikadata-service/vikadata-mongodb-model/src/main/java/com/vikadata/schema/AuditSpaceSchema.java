package com.vikadata.schema;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * <p>
 * audit space
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(collection = "vika_audit_space")
public class AuditSpaceSchema {

    private Long userId;

    @Indexed(name = "idx_space")
    private String spaceId;

    @Indexed(name = "idx_member")
    private Long memberId;

    private String memberName;

    private String ipAddress;

    private String userAgent;

    private String category;

    @Indexed(name = "idx_action")
    private String action;

    /**
     * Action Detailed Information
     */
    private Object info;

    private LocalDateTime createdAt;

}
