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
 * 经济模块-订单付款记录表
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
@TableName("vika_economic_order_payment")
public class EconomicOrderPaymentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间站ID
     */
    private String spaceId;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 交易号
     */
    private String paymentTransactionNo;

    /**
     * ISO货币代码(大写字母)
     */
    private String currency;

    /**
     * 金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer amount;

    /**
     * 支付渠道属性值(balance等等)
     */
    private String payChannel;

    /**
     * 支付渠道属性值(balance等等)
     */
    private String payChannelTransactionId;

    /**
     * 付款时间
     */
    private LocalDateTime paymentDate;

    /**
     * 是否付款成功(0:否,1:是)
     */
    private Boolean paymentSuccess;

    /**
     * 描述
     */
    private String description;

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
