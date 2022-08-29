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
 * V码系统-V码表
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
@TableName("vika_code")
public class CodeEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 类型(0:官方邀请码;1:个人邀请码;2:兑换码)
     */
    private Integer type;

    /**
     * 活动ID(关联#vika_code_activity#id)
     */
    private Long activityId;

    /**
     * 关联ID(第三方会员ID/用户ID/兑换模板ID)
     */
    private Long refId;

    /**
     * V码
     */
    private String code;

    /**
     * 可使用总数
     */
    private Integer availableTimes;

    /**
     * 剩余次数
     */
    private Integer remainTimes;

    /**
     * 单人限制使用次数
     */
    private Integer limitTimes;

    /**
     * 过期时间
     */
    private LocalDateTime expiredAt;

    /**
     * 指定使用者用户ID
     */
    private Long assignUserId;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Integer isDeleted;

    /**
     * 创建者
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 最后修改者
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
