package com.vikadata.scheduler.space.service;

import java.text.ParseException;
import java.util.List;

import com.vikadata.scheduler.space.model.SpaceApiUsageDto;

/**
 * <p>
 * Api Usage Statistics Service
 * </p>
 */
public interface IApiStatisticsService {

    /**
     * Synchronize API daily usage data
     */
    void syncApiUsageDailyData(List<SpaceApiUsageDto> spaceApiUsageDtoList);

    /**
     * Sync API monthly usage data
     */
    void syncApiUsageMonthlyData(List<SpaceApiUsageDto> spaceApiUsageDtoList);

    /**
     * Space API daily usage statistics
     */
    void spaceApiUsageDailyStatistics();

    /**
     * Space API monthly usage statistics
     */
    void spaceApiUsageMonthlyStatistics() throws ParseException;

}

