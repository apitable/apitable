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
 * 自动化-机器人-运行历史表
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
@TableName("vika_automation_run_history")
public class AutomationRunHistoryEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 自定义运行任务ID
     */
    private String taskId;

    /**
     * 机器人ID
     */
    private String robotId;

    /**
     * [冗余]当前任务机器人所属的空间站ID
     */
    private String spaceId;

    /**
     * 运行状态(0:运行中,1:成功,2:失败)
     */
    private Integer status;

    /**
     * 运行上下文详细信息
     */
    private String data;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
