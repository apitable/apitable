package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 工作空间表
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
@TableName(keepGlobalPrefix = true, value = "space")
public class SpaceEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间唯一标识字符
     */
    private String spaceId;

    /**
     * 空间名称
     */
    private String name;

    /**
     * 空间图标
     */
    private String logo;

    /**
     * 空间级别
     */
    private Long level;

    /**
     * 选项参数
     */
    private String props;

    /**
     * 预删除时间
     */
    private LocalDateTime preDeletionTime;

    /**
     * 是否全员可邀请成员(0:否,1:是)
     */
    private Boolean isInvite;

    /**
     * 是否禁止全员导出维格表(0:否,1:是)
     */
    private Boolean isForbid;

    /**
     * 是否允许他人申请加入空间站(0:否,1:是)
     */
    private Boolean allowApply;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 拥有者
     */
    private Long owner;

    /**
     * 创建者
     */
    private Long creator;

    /**
     * 创建用户
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 最后一次更新用户
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
