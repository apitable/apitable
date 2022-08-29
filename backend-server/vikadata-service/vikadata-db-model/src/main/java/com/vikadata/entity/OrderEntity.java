package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 订阅计费系统-订单表
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
@TableName("vika_billing_order")
public class OrderEntity implements Serializable {

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
    private String orderId;

    /**
     * 订单渠道(vika,lark,dingtalk,wecom)
     */
    private String orderChannel;

    /**
     * 其他渠道订单号
     */
    private String channelOrderId;

    /**
     * 订单类型(BUY: 普通, UPGRADE: 升级, RENEW: 续订)
     */
    private String orderType;

    /**
     * ISO货币代码(大写字母)
     */
    private String currency;

    /**
     * 订单总金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer originalAmount;

    /**
     * 优惠总金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer discountAmount;

    /**
     * 订单支付金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer amount;

    /**
     * 订单状态(待支付-created,已支付-paid,已退款-refunded,已取消-canceled)
     */
    private String state;

    /**
     * 订单创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 是否已支付(0:否,1:是)
     */
    private Boolean isPaid;

    /**
     * 订单支付完成时间
     */
    private LocalDateTime paidTime;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 备注
     */
    private String remark;

    /**
     * 乐观锁版本号
     */
    @Version
    private Integer version;

    /**
     * 创建者
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 最后修改者
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
