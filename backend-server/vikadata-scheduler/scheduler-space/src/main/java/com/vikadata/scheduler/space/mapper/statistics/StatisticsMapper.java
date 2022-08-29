package com.vikadata.scheduler.space.mapper.statistics;

/**
 * <p>
 *
 * </p>
 *
 * @author Chambers
 * @date 2022/5/25
 */
public interface StatisticsMapper {

    /**
     * 查询API用量表最大的表ID
     *
     * @return id
     * @author Chambers
     * @date 2022/5/25
     */
    Long selectApiUsageMaxId();
}
