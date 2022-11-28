package com.vikadata.entity;

import com.baomidou.mybatisplus.annotation.IdType;
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
 * 企微服务商接口许可下单信息
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
@TableName(keepGlobalPrefix = true, value = "social_wecom_permit_order")
public class SocialWecomPermitOrderEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键 ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 应用套件 ID
     */
    private String suiteId;

    /**
     * 授权的企业 ID
     */
    private String authCorpId;

    /**
     * 接口许可的订单号
     */
    private String orderId;

    /**
     * 订单类型。1：购买帐号；2：续期帐号；5：历史企业迁移订单
     */
    private Integer orderType;

    /**
     * 订单状态。0：待支付；1：已支付；2：未支付，订单已关闭；3：未支付，订单已过期；4：申请退款中；5：退款成功；6：退款被拒绝；7：订单已失效（将企业从服务商测试企业列表中移除时会将对应测试企业的所有测试订单置为已失效）
     */
    private Integer orderStatus;

    /**
     * 订单金额，单位分
     */
    private Integer price;

    /**
     * 基础帐号个数
     */
    private Integer baseAccountCount;

    /**
     * 互通帐号个数
     */
    private Integer externalAccountCount;

    /**
     * 购买的月数，每个月按照31天计算
     */
    private Integer durationMonths;

    /**
     * 订单的创建时间
     */
    private LocalDateTime createTime;

    /**
     * 订单的支付时间
     */
    private LocalDateTime payTime;

    /**
     * 下单人的企微用户 ID
     */
    private String buyerUserId;

    /**
     * 删除标记。0：否；1：是
     */
    @TableLogic
    private Integer isDeleted;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;


}
