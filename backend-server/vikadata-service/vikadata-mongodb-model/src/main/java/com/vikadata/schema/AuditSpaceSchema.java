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
 *
 * @author Chambers
 * @date 2022/5/25
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(collection = "vika_audit_space")
public class AuditSpaceSchema {

    /**
     * 用户ID(关联#vika_user#id)
     */
    private Long userId;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    @Indexed(name = "idx_space")
    private String spaceId;

    /**
     * 成员ID(关联#vika_unit_member#id)
     */
    @Indexed(name = "idx_member")
    private Long memberId;

    /**
     * 成员名称
     */
    private String memberName;

    /**
     * 操作地址
     */
    private String ipAddress;

    /**
     * ua
     */
    private String userAgent;

    /**
     * 分类
     */
    private String category;

    /**
     * 用户行为
     */
    @Indexed(name = "idx_action")
    private String action;

    /**
     * 行为具体信息
     */
    private Object info;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
