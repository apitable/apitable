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
 * 实验性功能内测申请表
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
@TableName(keepGlobalPrefix = true, value = "labs_applicant")
public class LabsApplicantEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 申请者类型(0:user_feature, 1:space_feature)
     */
    private Integer applicantType;

    /**
     * 申请者Id,可以是spaceId或者userId
     */
    private String applicant;

    /**
     * 实验性功能标识
     */
    private String featureKey;

    /**
     * 删除标记(0:否, 1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 申请创建人
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 数据记录创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 数据记录修改时间
     */
    private LocalDateTime updatedAt;

}
