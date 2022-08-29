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
 * 订阅计费系统-订单交易表
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
@TableName("vika_billing_order_payment")
public class OrderPaymentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 订单号
     */
    private String orderId;

    /**
     * 支付交易号
     */
    private String paymentTransactionId;

    /**
     * ISO货币代码(大写字母)
     */
    private String currency;

    /**
     * 金额(对应币种的最小货币单位,人民币为分)
     */
    private Integer amount;

    /**
     * 第三方支付商品标题
     */
    private String subject;

    /**
     * 支付渠道属性值
     */
    private String payChannel;

    /**
     * 支付渠道交易标识
     */
    private String payChannelTransactionId;

    /**
     * 付款时间
     */
    private LocalDateTime paidTime;

    /**
     * 是否付款成功(0:否,1:是)
     */
    private Boolean paymentSuccess;

    /**
     * 支付回调通知源数据
     */
    private String rawData;

    /**
     * 描述
     */
    private String remark;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

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
