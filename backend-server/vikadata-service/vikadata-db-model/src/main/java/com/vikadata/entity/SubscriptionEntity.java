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
 * 订阅计费系统-订阅表
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
@TableName("vika_billing_subscription")
public class SubscriptionEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 订阅套餐ID
     */
    private String bundleId;

    /**
     * 订阅ID
     */
    private String subscriptionId;

    /**
     * 产品ID
     */
    private String productName;

    /**
     * 产品类型
     */
    private String productCategory;

    /**
     * 产品方案ID
     */
    private String planId;

    /**
     * 状态(active, expire)
     */
    private String state;

    /**
     * 项目阶段(trial:试用,fixedterm:固定期限)
     */
    private String phase;

    /**
     * 元数据
     */
    private String metadata;

    /**
     * 订阅套餐开始时间
     */
    private LocalDateTime bundleStartDate;

    /**
     * 开始时间
     */
    private LocalDateTime startDate;

    /**
     * 过期时间
     */
    private LocalDateTime expireDate;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

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
