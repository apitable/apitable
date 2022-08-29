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
 * 第三方平台集成-企业租户部门表
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
@TableName("vika_social_tenant_department")
public class SocialTenantDepartmentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 企业标识
     */
    private String tenantId;

    /**
     * 企业绑定的空间站标识
     */
    private String spaceId;

    /**
     * 部门ID
     */
    private String departmentId;

    /**
     * 部门 open ID
     */
    private String openDepartmentId;

    /**
     * 父部门 ID
     */
    private String parentId;

    /**
     * 父部门 open ID
     */
    private String parentOpenDepartmentId;

    /**
     * 部门名称
     */
    private String departmentName;

    /**
     * 部门排序
     */
    private Integer departmentOrder;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
