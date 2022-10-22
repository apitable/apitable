package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.entity.SubscriptionEntity;

/**
 * 套餐订阅服务
 * @author Shawn Deng
 * @date 2022-05-16 21:52:39
 */
public interface ISubscriptionService extends IService<SubscriptionEntity> {

    /**
     * 创建订阅
     * @param entity 实体
     */
    void create(SubscriptionEntity entity);

    /**
     * 批量创建订阅
     * @param entities 实体
     */
    void createBatch(List<SubscriptionEntity> entities);

    /**
     * 根据订阅ID查询
     * @param subscriptionId 订阅ID
     * @return SubscriptionEntity
     */
    SubscriptionEntity getBySubscriptionId(String subscriptionId);

    /**
     * 获取订阅捆绑包的订阅集合
     * @param bundleId 订阅捆绑包标识
     * @return subscription entities
     */
    List<SubscriptionEntity> getByBundleId(String bundleId);

    /**
     * 批量获取订阅捆绑包的订阅集合
     * @param bundleIds 订阅捆绑包标识列表
     * @return subscription entities
     */
    List<SubscriptionEntity> getByBundleIds(List<String> bundleIds);

    /**
     * 批量获取不同订阅捆绑集合的订阅条目
     * @param bundleIds 订阅捆绑包标识列表
     * @return Subscription List
     */
    List<Subscription> getSubscriptionsByBundleIds(List<String> bundleIds);

    /**
     * 更改订阅条目信息
     * @param subscriptionId 订阅条目标识
     * @param updatedSubscription 订阅条目对象
     */
    void updateBySubscriptionId(String subscriptionId, SubscriptionEntity updatedSubscription);

    /**
     * 批量获取订阅捆绑包的订阅集合
     * @param bundleId 订阅捆绑包标识
     * @param state 订阅状态
     * @return List<FinanceSubscriptionEntity>
     * @author zoe zheng
     * @date 2022/5/26 12:09
     */
    List<SubscriptionEntity> getByBundleIdAndState(String bundleId, SubscriptionState state);

    /**
     * 批量删除
     * @param subscriptionIds 订阅条目
     * @author zoe zheng
     * @date 2022/6/7 10:25
     */
    void removeBatchBySubscriptionIds(List<String> subscriptionIds);

    /**
     * restore subscription
     * @param subscriptionId Subscription id
     */
    void restoreBySubscriptionIds(List<String> subscriptionId);

    /**
     * Get last subscription id for subscription bundles in bulk
     * @param spaceId space id
     * @return subscription id
     */
    String getActiveTrailSubscriptionIdBySpaceId(String spaceId);

}