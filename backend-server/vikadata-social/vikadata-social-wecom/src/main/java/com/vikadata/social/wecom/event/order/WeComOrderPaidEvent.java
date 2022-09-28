package com.vikadata.social.wecom.event.order;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 企微订单已付款
 * </p>
 * @author 刘斌华
 * @date 2022-08-10 09:53:03
 */
@Setter
@Getter
@ToString
public class WeComOrderPaidEvent extends BaseWeComOrderEvent {

    /**
     * 订单状态。0-待支付，1-已支付，2-已取消， 3-支付过期， 4-申请退款中， 5-退款成功， 6-退款被拒绝
     */
    private Integer orderStatus;

    /**
     * 订单类型。0-新购应用，1-扩容应用人数，2-续期应用时间，3-变更版本
     */
    private Integer orderType;

    /**
     * 下单操作人员userid。如果是服务商代下单，没有该字段。
     */
    private String operatorId;

    /**
     * 购买版本ID
     */
    private String editionId;

    /**
     * 购买版本名字
     */
    private String editionName;

    /**
     * 应付价格，单位分
     */
    private Integer price;

    /**
     * 购买的人数
     */
    private Long userCount;

    /**
     * 购买的时长，单位为天
     */
    private Integer orderPeriod;

    /**
     * 下单时间（UNIX时间戳）。秒
     */
    private Long orderTime;

    /**
     * 付款时间（UNIX时间戳）。秒
     */
    private Long paidTime;

    /**
     * 购买生效期的开始时间（UNIX时间戳）。秒
     */
    private Long beginTime;

    /**
     * 购买生效期的结束时间（UNIX时间戳）。秒
     */
    private Long endTime;

    /**
     * 下单来源。0-企业下单；1-服务商代下单；2-代理商代下单
     */
    private Integer orderFrom;

    /**
     * 下单方corpid
     */
    private String operatorCorpId;

    /**
     * 服务商分成金额，单位分
     */
    private Integer serviceShareAmount;

    /**
     * 平台分成金额，单位分
     */
    private Integer platformShareAmount;

    /**
     * 代理商分成金额，单位分
     */
    private Integer dealerShareAmount;

    /**
     * 渠道商信息（仅当有渠道商报备后才会有此字段）
     */
    private DealerCorpInfo dealerCorpInfo;

    @Setter
    @Getter
    public static class DealerCorpInfo implements Serializable {

        /**
         * 代理商corpid
         */
        private String corpId;

        /**
         * 代理商的企业简称
         */
        private String corpName;

    }

}
