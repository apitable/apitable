package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
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
 * 实验性功能表
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
@TableName(keepGlobalPrefix = true, value = "labs_features")
public class LabsFeaturesEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 实验室功能唯一标识
     */
    private String featureKey;

    /**
     * 实验性功能类别(user:用户级别,space:空间站级别)
     */
    private Integer featureScope;

    /**
     * 实验室功能的类型(static:不准操作, review:可申请，normal:可正常开关)
     */
    private Integer type;

    /**
     * 实验功能申请表单地址
     */
    private String url;

    /**
     * 删除标记(0:否, 1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 数据创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 数据修改时间
     */
    private LocalDateTime updatedAt;

}
