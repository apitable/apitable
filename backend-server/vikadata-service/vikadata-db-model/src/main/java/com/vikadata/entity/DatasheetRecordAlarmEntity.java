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
 * 工作台-数表记录通知表
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
@TableName("vika_datasheet_record_alarm")
public class DatasheetRecordAlarmEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 闹钟ID
     */
    private String alarmId;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 数表ID(关联#vika_datasheet#dst_id)
     */
    private String dstId;

    /**
     * 记录ID(关联#vika_datasheet_record#record_id)
     */
    private String recordId;

    /**
     * 数表列ID
     */
    private String fieldId;

    /**
     * 通知时间
     */
    private LocalDateTime alarmAt;

    /**
     * 状态：0-默认、1-处理中、2-处理成功、3-处理失败
     */
    private Integer alarmStatus;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Integer isDeleted;

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
