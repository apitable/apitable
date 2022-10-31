package com.vikadata.scheduler.space.cache.service;

/**
 * <p>
 * Redis Service
 * </p>
 */
public interface RedisService {

    /**
     * Delete user active space cache
     *
     * @param userId user table id
     */
    void delActiveSpace(Long userId);

    /**
     * Get the maximum id of yesterday's changeset table
     *
     * @return ID
     */
    Long getYesterdayMaxChangeId();

    /**
     * Refresh api usage meter's minimum table id cache for next month
     */
    void refreshApiUsageNextMonthMinId();
}
