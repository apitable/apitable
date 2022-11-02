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
 */
public interface ISocialOrderService<T, R> extends InitializingBean {

    /**
     * retrieve order paid event
     *
     * @param event order event data
     * @return Order ID
     */
    String retrieveOrderPaidEvent(T event);

    /**
     * retrieve order paid event
     *
     * @param event refund order event data
     */
    void retrieveOrderRefundEvent(R event);

    /**
     * Migrate old data
     *
     * @param spaceId space id
     */
    void migrateEvent(String spaceId);

    /**
     * Build a unified social order context
     *
     * @param event social order event
     * @return SocialOrderContext
     */
    SocialOrderContext buildSocialOrderContext(T event);

    /**
     * Create order
     *
     * @param orderContext order content
     * @return order id
     */
    String createOrder(SocialOrderContext orderContext);

    /**
     * Create order detail
     *
     * @param orderContext      order content
     * @param subscriptionId    subscription id
     */
    void createOrderItem(String orderId, String subscriptionId, SocialOrderContext orderContext);

    /**
     * Create order metadata
     *
     * @param orderId       order id
     * @param orderChannel  order channel
     * @param event         order metadata
     */
    void createOrderMetaData(String orderId, OrderChannel orderChannel, T event);

    /**
     * Create subscription bundle
     *
     * @param orderContext order content
     * @return bundle id
     */
    String createBundle(SocialOrderContext orderContext);

    /**
     * Create subscription
     *
     * @param bundleId      bundle id
     * @param orderContext  order content
     * @return order id
     */
    String createSubscription(String bundleId, SocialOrderContext orderContext);

    /**
     * Renewal space subscription collection
     *
     * @param orderContext order content
     */
    String renewSubscription(SocialOrderContext orderContext);

    /**
     * Upgrade space subscription collection
     *
     * @param orderContext order content
     */
    String upgradeSubscription(SocialOrderContext orderContext);

    /**
     * Update the end time of the space collection
     *
     * @param orderContext order content
     */
    void updateBundleEndDate(SocialOrderContext orderContext);
}
