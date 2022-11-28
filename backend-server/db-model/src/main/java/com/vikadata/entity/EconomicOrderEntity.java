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
 * 经济模块-订单表
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
@TableName(keepGlobalPrefix = true, value = "economic_order")
public class EconomicOrderEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 订单渠道(vika,lark,dingtalk,wecom)
     */
    private String orderChannel;

    /**
     * 其他渠道订单号
     */
    private String channelOrderId;

    /**
     * 产品类型
     */
    private String product;

    /**
     * 订单类型(0: 新购, 1: 升级, 2: 续订)
     */
    private Integer type;

    /**
     * 席位数
     */
    private Integer seat;

    /**
     * 月数
     */
    private Integer month;

    /**
     * 空间站ID
     */
    private String spaceId;

    /**
     * 优惠券ID
     */
    private String couponId;

    /**
     * ISO货币代码(大写字母)
     */
    private String currency;

    /**
     * 订单原始金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer amount;

    /**
     * 优惠券金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer couponAmount;

    /**
     * 订单实付金额(对应币种的最小货币单位,人民币为分,计算规则:amount-coupon_amount)
     */
    private Integer actualAmount;

    /**
     * 订单额外备注说明
     */
    private String description;

    /**
     * 发起支付请求客户端的IP地址
     */
    private String clientIp;

    /**
     * 订单状态(待支付-created,已支付-paid,已退款-refunded,已取消-canceled)
     */
    private String status;

    /**
     * 订单创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 是否已支付(0:否,1:是)
     */
    private Boolean isPaid;

    /**
     * 支付渠道属性值(balance等等)
     */
    private String payChannel;

    /**
     * 支付渠道交易流水号
     */
    private String payChannelTradeNo;

    /**
     * 订单支付完成时间
     */
    private LocalDateTime paidTime;

    /**
     * 订单失效完成时间
     */
    private LocalDateTime expireTime;

    /**
     * 订单阶段(trial:试用,fixedterm:固定期限)
     */
    private String orderPhase;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 乐观锁版本号
     */
    private Integer version;

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
