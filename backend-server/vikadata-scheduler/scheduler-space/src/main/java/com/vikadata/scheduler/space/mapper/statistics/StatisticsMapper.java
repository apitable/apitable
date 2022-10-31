package com.vikadata.scheduler.space.mapper.statistics;

/**
 * <p>
 * Statistics Mapper
 * </p>
 */
public interface StatisticsMapper {

    /**
     * Query the table ID with the largest API usage meter
     *
     * @return id
     */
    Long selectApiUsageMaxId();
}
