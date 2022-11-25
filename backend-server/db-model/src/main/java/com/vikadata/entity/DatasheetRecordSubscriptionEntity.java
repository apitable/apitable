package com.vikadata.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import lombok.experimental.Accessors;

/**
 * <p>
 * 工作台-数表记录订阅表
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
@TableName("vika_datasheet_record_subscription")
public class DatasheetRecordSubscriptionEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 数表ID(关联#vika_datasheet#dst_id)
     */
    private String dstId;

    /**
     * 镜像节点ID
     */
    private String mirrorId;

    /**
     * 数据记录ID(关联#vika_datasheet_record#record_id)
     */
    private String recordId;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Integer isDeleted;

    /**
     * 创建者(即订阅者)
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
