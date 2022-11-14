package com.vikadata.api.enterprise.billing.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.billing.enums.SubscriptionState;
import com.vikadata.api.space.model.SpaceSubscriptionDto;
import com.vikadata.api.enterprise.billing.util.model.ProductCategory;
import com.vikadata.entity.SubscriptionEntity;

/**
 * Subscription Billing System - Subscription Mapper
 */
public interface SubscriptionMapper extends BaseMapper<SubscriptionEntity> {

    /**
     * Query by subscription id
     *
     * @param subscriptionId subscription id
     * @return subscription entity
     */
    SubscriptionEntity selectBySubscriptionId(@Param("subscriptionId") String subscriptionId);

    /**
     * Batch query by subscription id
     *
     * @param subscriptionIds subscription id list
     * @return bundle list
     */
    List<SubscriptionEntity> selectBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds);

    /**
     * Query by bundle id
     *
     * @param bundleId  bundle id
     * @return subscription entities
     */
    List<SubscriptionEntity> selectByBundleId(@Param("bundleId") String bundleId);

    /**
     * Batch query by bundle id
     *
     * @param bundleIds bundle id list
     * @return subscription entities
     */
    List<SubscriptionEntity> selectByBundleIds(@Param("bundleIds") Collection<String> bundleIds);

    /**
     * Query by bundle id and state
     *
     * @param bundleId  bundle id
     * @param state     subscription state
     * @return List<FinanceSubscriptionEntity>
     */
    List<SubscriptionEntity> selectByBundleIdAndState(@Param("bundleId") String bundleId,
            @Param("state") SubscriptionState state);

    /**
     * Batch update isDeleted status
     *
     * @param subscriptionIds   subscription id list
     * @param isDeleted         isDeleted status
     * @return number of rows affected
     */
    Integer updateIsDeletedBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds, @Param(
            "isDeleted") boolean isDeleted);

    /**
     * Query the attachment capacity information in effect
     */
    IPage<SpaceSubscriptionDto> selectUnExpireCapacityBySpaceId(@Param("spaceId") String spaceId, Page page, @Param("state") SubscriptionState state);

    /**
     * Query invalid attachment capacity information
     */
    IPage<SpaceSubscriptionDto> selectExpireCapacityBySpaceId(@Param("spaceId") String spaceId, Page page);

    /**
     * Query the number of gifted unexpired attachment capacity
     */
    Integer selectUnExpireGiftCapacityBySpaceId(@Param("spaceId") String spaceId, @Param("planId") String planId, @Param("state") SubscriptionState state);

    /**
     * Query space has not expired BASE type subscription
     */
    Integer selectUnExpireBaseProductBySpaceId(@Param("spaceId") String spaceId, @Param("state") SubscriptionState state, @Param("category") ProductCategory category);

    /**
     * get space subscription_id list
     *
     * @param spaceId space id
     * @param phase trial,fixedterm
     * @return subscription id
     */
    String selectSubscriptionIdBySpaceIdAndPhaseIgnoreDeleted(@Param("spaceId") String spaceId, @Param("phase") String phase);

    /**
     * get subscription count by bundle id
     *
     * @param bundleIds bundle id list
     * @return count
     */
    Integer selectCountByBundleIds(@Param("bundleIds") List<String> bundleIds);

    /**
     * select subscription's bundle id list
     *
     * @param subscriptionIds subscription id list
     * @return list of bundle id
     */
    List<String> selectBundleIdsBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds);
}
