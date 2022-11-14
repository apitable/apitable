package com.vikadata.api.enterprise.billing.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enterprise.billing.enums.BundleState;
import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.entity.BundleEntity;

/**
 * <p>
 * Bundle Service
 * </p>
 */
public interface IBundleService extends IService<BundleEntity> {

    /**
     * Create subscription bundle
     *
     * @param entity entity
     */
    void create(BundleEntity entity);

    /**
     * Batch create subscription bundle
     *
     * @param entities entities
     */
    void createBatch(List<BundleEntity> entities);

    /**
     * Get subscription bundle
     *
     * @param bundleId bundle id
     * @return bundle entity
     */
    BundleEntity getByBundleId(String bundleId);

    /**
     * Get subscription bundle list
     *
     * @param spaceId space id
     * @return bundle entity list
     */
    List<BundleEntity> getBySpaceId(String spaceId);

    /**
     * Batch get subscription bundle list
     *
     * @param spaceIds space id list
     * @return bundle list
     */
    List<BundleEntity> getBySpaceIds(List<String> spaceIds);

    /**
     * Get a subscription to the activation status of the space station
     * * Include only active state
     *
     * @param spaceId space id
     * @return bundle
     */
    Bundle getActivatedBundleBySpaceId(String spaceId);

    /**
     * get possible active bundle by space id
     *
     * @param spaceId space id
     * @return active bundle
     */
    Bundle getPossibleBundleBySpaceId(String spaceId);

    /**
     * Get all subscription bundles for the space station
     * Subscription bundle with all states
     *
     * @param spaceId space id
     * @return bundle List
     */
    List<Bundle> getBundlesBySpaceId(String spaceId);

    /**
     * Batch get subscriptions for the activation status of the space station
     * * Include only active state
     *
     * @param spaceIds space id list
     * @return bundle List
     */
    List<Bundle> getActivatedBundlesBySpaceId(List<String> spaceIds);

    /**
     * Batch get all subscription bundles for the space station
     * * Subscription bundle with all states
     *
     * @param spaceIds space id list
     * @return bundle list
     */
    List<Bundle> getBundlesBySpaceIds(List<String> spaceIds);

    /**
     * Update subscription bundle
     *
     * @param bundleId      bundle id
     * @param updatedBundle updated bundle
     */
    void updateByBundleId(String bundleId, BundleEntity updatedBundle);

    /**
     * Batch get space subscription bundle
     *
     * @param spaceId   space id
     * @param state     bundle state
     * @return List<FinanceBundleEntity>
     */
    List<BundleEntity> getBySpaceIdAndState(String spaceId, BundleState state);

    /**
     * Batch remove
     *
     * @param bundleId bundle id
     */
    void removeBatchByBundleIds(List<String> bundleId);

    /**
     * restore by bundle ids
     * @param bundleIds bundle id
     */
    void restoreByBundleIds(List<String> bundleIds);
}
