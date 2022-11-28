package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
 * 工作台-资源操作变更合集表
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
@TableName(keepGlobalPrefix = true, value = "resource_changeset")
public class ResourceChangesetEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 资源ID(node_id/widget_id/..)
     */
    private String resourceId;

    /**
     * 资源类型(0:数表;1:收集表;2:仪表盘;3:组件)
     */
    private Integer resourceType;

    /**
     * changeset请求的唯一标识，用于保证changeset的唯一
     */
    private String messageId;

    /**
     * 操作action的合集
     */
    private String operations;

    /**
     * 版本号
     */
    private Long revision;

    /**
     * 数据来源类型(0:默认)
     */
    private Integer sourceType;

    /**
     * 创建用户
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
