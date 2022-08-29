package com.vikadata.social.dingtalk.event.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * <p>
 * 当biz_type=37时，数据为订单到期或者退款导致的服务关闭数据。
 * 该数据为企业在钉钉服务市场购买开通应用产生订单时刻推送，插入表open_sync_biz_data中。
 * syncAction为market_service_close表示因订单到期或者用户退款等导致的服务关闭。
 * 注意 目前仅推送因退款导致的服务关闭。
 * </p>
 * @author zoe zheng
 * @date 2021/10/25 11:37
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_HIGH, action = DingTalkSyncAction.MARKET_SERVICE_CLOSE)
public class SyncHttpMarketServiceCloseEvent extends BaseOrderEvent {
    /**
     * 事件类型：subscription_close
     */
    private String eventType;

    /**
     * 关闭类型：
     * 1：升级关闭
     * 2：到期关闭
     * 3：退款关闭
     * 4：其他关闭
     * 注意 目前仅推送3退款关闭。
     */
    private Integer closeType;

    private Integer pushType;

    /**
     * 退款单id，退款唯一标识。已经不返回了
     */
    private String refundId;

    /**
     * 开通类型。
     * 说明 目前针对订购开通的消息只推送开通类型为 “续费变配开通”，取值为：3。
     */
    private Integer openType;
}
