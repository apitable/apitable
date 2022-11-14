package com.vikadata.api.enterprise.billing.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.billing.enums.BundleState;
import com.vikadata.entity.BundleEntity;

/**
 * Subscription Billing System - Bundle Mapper
 */
public interface BundleMapper extends BaseMapper<BundleEntity> {

    /**
     * Query subscription bundle by bundle id
     *
     * @param bundleId subscription bundle id
     * @return bundle list
     */
    BundleEntity selectByBundleId(@Param("bundleId") String bundleId);

    /**
     * Batch query subscription bundle by bundle id list
     *
     * @param bundleIds subscription bundle id list
     * @return bundle list
     */
    List<BundleEntity> selectByBundleIds(@Param("bundleIds") List<String> bundleIds);

    /**
     * Query subscription bundle by space id
     *
     * @param spaceId space id
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query subscription bundle by space id list
     *
     * @param spaceIds space id list
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceIds(@Param("spaceIds") Collection<String> spaceIds);

    /**
     * Query subscription bundle by space id and state
     *
     * @param spaceId space id
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceIdAndByState(@Param("spaceId") String spaceId, @Param("state") BundleState state);

    /**
     * Update isDeleted status
     *
     * @param bundleIds subscription bundle id list
     * @param isDeleted isDeleted status
     * @return number of rows affected
     */
    Integer updateIsDeletedByBundleIds(@Param("bundleIds") List<String> bundleIds, @Param("isDeleted") boolean isDeleted);
}
