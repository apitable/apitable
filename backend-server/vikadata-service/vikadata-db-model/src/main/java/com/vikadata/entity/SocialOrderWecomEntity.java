package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
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
 * 企业微信订单信息
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Deprecated
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_social_order_wecom")
public class SocialOrderWecomEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键 ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 企业微信的订单号
     */
    private String orderId;

    /**
     * 订单状态。0：待支付；1：已支付；2：已取消；3：支付过期；4：申请退款中；5：退款成功；6：退款被拒绝
     */
    private Integer orderStatus;

    /**
     * 订单类型。0：新购应用；1：扩容应用人数；2：续期应用时间；3：变更版本
     */
    private Integer orderType;

    /**
     * 下单的企业 ID
     */
    private String paidCorpId;

    /**
     * 下单操作人员 userid。如果是服务商代下单，没有该字段
     */
    private String operatorId;

    /**
     * 应用套件 ID
     */
    private String suiteId;

    /**
     * 购买的应用版本 ID
     */
    private String editionId;

    /**
     * 应付价格。单位：分
     */
    private Integer price;

    /**
     * 购买的人数
     */
    private Long userCount;

    /**
     * 购买的时长。单位：天
     */
    private Integer orderPeriod;

    /**
     * 下单时间
     */
    private LocalDateTime orderTime;

    /**
     * 付款时间
     */
    private LocalDateTime paidTime;

    /**
     * 购买生效期的开始时间
     */
    private LocalDateTime beginTime;

    /**
     * 购买生效期的结束时间
     */
    private LocalDateTime endTime;

    /**
     * 下单来源。0：企业下单；1：服务商代下单；2：代理商代下单
     */
    private Integer orderFrom;

    /**
     * 下单方的企业 ID
     */
    private String operatorCorpId;

    /**
     * 服务商分成金额。单位：分
     */
    private Integer serviceShareAmount;

    /**
     * 平台分成金额。单位：分
     */
    private Integer platformShareAmount;

    /**
     * 代理商分成金额。单位：分
     */
    private Integer dealerShareAmount;

    /**
     * 代理商的企业 ID
     */
    private String dealerCorpId;

    /**
     * 订单原始数据
     */
    private String orderInfo;

    /**
     * 删除标记。0：否；1：是
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;


}
