package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 邀请记录审计表
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "audit_invite_record")
public class AuditInviteRecordEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * [冗余]空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 邀请者成员ID(关联#vika_unit_member#id)
     */
    private Long inviter;

    /**
     * 受邀者成员ID(关联#vika_unit_member#id)
     */
    private Long accepter;

    /**
     * 受邀类型(0:邮箱邀请;1:文件导入;2:链接邀请)
     */
    private Integer type;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
