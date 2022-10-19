package com.vikadata.api.modular.finance.strategy;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.modular.finance.model.SocialOrderContext;

import org.springframework.beans.factory.InitializingBean;

/**
 * <p>
 * third party orders service interface
 * T order event
 * R refund order event
 * </p>
 * @author zoe zheng
 * @date 2022/5/18 18:34
 */
public interface ISocialOrderService<T, R> extends InitializingBean {
    /**
     * retrieve order paid event
     * @param event order event data
     * @return Order ID
     * @author zoe zheng
     * @date 2022/5/18 17:44
     */
    String retrieveOrderPaidEvent(T event);

    /**
     * retrieve order paid event
     * @param event refund order event data
     * @author zoe zheng
     * @date 2022/5/18 17:44
     */
    void retrieveOrderRefundEvent(R event);

    /**
     * 迁移旧数据
     * @param spaceId 空间站ID
     * @author zoe zheng
     * @date 2022/6/1 16:32
     */
    void migrateEvent(String spaceId);

    /**
     * 构建统一的第三方订单上下文
     *
     * @param event 第三方订单事件
     * @return SocialOrderContext
     * @author zoe zheng
     * @date 2022/5/26 17:07
     */
    SocialOrderContext buildSocialOrderContext(T event);

    /**
     * 创建订单
     * @param orderContext 订单上下文
     * @return 订单号
     * @author zoe zheng
     * @date 2022/5/26 17:13
     */
    String createOrder(SocialOrderContext orderContext);

    /**
     * 创建订单明细
     * @param orderContext 订单上下文
     * @param subscriptionId 订阅ID
     * @author zoe zheng
     * @date 2022/5/26 17:25
     */
    void createOrderItem(String orderId, String subscriptionId, SocialOrderContext orderContext);

    /**
     * 创建订单元数据
     * @param orderId 订单号
     * @param orderChannel 订单渠道
     * @param event 订单源数据
     * @author zoe zheng
     * @date 2022/5/26 17:41
     */
    void createOrderMetaData(String orderId, OrderChannel orderChannel, T event);

    /**
     * 创建订阅集合
     * @param orderContext 订单上下文
     * @return 集合ID
     * @author zoe zheng
     * @date 2022/5/26 17:46
     */
    String createBundle(SocialOrderContext orderContext);

    /**
     * 创建订阅
     *
     * @param bundleId 订阅集合
     * @param orderContext 订单上下文
     * @return 订阅ID
     * @author zoe zheng
     * @date 2022/5/26 18:54
     */
    String createSubscription(String bundleId, SocialOrderContext orderContext);

    /**
     * 续费空间订阅集合
     * @param orderContext 订单上下文
     * @author zoe zheng
     * @date 2022/5/26 19:10
     */
    String renewSubscription(SocialOrderContext orderContext);

    /**
     * 升级空间订阅集合
     * @param orderContext 订单上下文
     * @author zoe zheng
     * @date 2022/5/26 22:20
     */
    String upgradeSubscription(SocialOrderContext orderContext);

    /**
     * 更新空间集合的结束时间
     * @param orderContext 订单上下文
     * @author zoe zheng
     * @date 2022/5/26 22:23
     */
    void updateBundleEndDate(SocialOrderContext orderContext);
}
