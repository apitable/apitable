package com.vikadata.scheduler.space.mapper.developer;


import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.ApiRecordDto;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;
import com.vikadata.scheduler.space.pojo.ApiStatisticsDaily;
import com.vikadata.scheduler.space.pojo.ApiStatisticsMonthly;
import com.vikadata.scheduler.space.pojo.ApiUsage;

/**
 * <p>
 * Api Statistics Mapper
 * </p>
 */
public interface ApiStatisticsMapper {

    /**
     * Query the first record of the API usage meter
     *
     * @return ApiUsageEntity
     */
    ApiUsage selectFirstApiUsageRecord();

    /**
     * Query the first record after the specified ID and creation time the next day
     *
     * @param id        table id
     * @param createdAt createdAt
     * @return ApiUsageEntity
     */
    ApiUsage selectNextDayFirstRecord(@Param("id") Long id, @Param("createdAt") LocalDateTime createdAt);

    /**
     * Query daily maximum table ID
     *
     * @param statisticsTime statistics time
     * @return Long
     */
    Long selectMaxIdDaily(@Param("statisticsTime") String statisticsTime);

    /**
     * Query the monthly maximum table ID
     *
     * @param statisticsTime statistics time
     * @return Long
     */
    Long selectMaxIdMonthly(@Param("statisticsTime") String statisticsTime);

    /**
     * Query the first data of the API usage meter
     *
     * @return ApiRecordDto
     */
    ApiRecordDto selectFirstApiRecord();

    /**
     * Query the minimum record ID of API usage per month
     *
     * @param id        API usage record ID
     * @param monthTime month time
     * @return id
     */
    Long selectMinIdMonthly(@Param("id") Long id, @Param("monthTime") String monthTime);

    /**
     * Querying the daily API usage information of the space station
     *
     * @param beginId   Statistics start table id
     * @param endId     Statistics end table id
     * @return SpaceApiUsageDto
     */
    List<SpaceApiUsageDto> selectSpaceApiUsageDaily(@Param("beginId") Long beginId, @Param("endId") Long endId);

    /**
     * Querying the monthly API usage information of the space station
     *
     * @param beginId   Statistics start table id
     * @param endId     Statistics end table id
     * @return SpaceApiUsageDto
     */
    List<SpaceApiUsageDto> selectSpaceApiUsageMonthly(@Param("beginId") Long beginId, @Param("endId") Long endId);

    /**
     * query the last record in the daily API usage statistics table
     *
     * @return ApiStatisticsDailyEntity
     */
    ApiStatisticsDaily selectLastApiUsageDailyRecord();

    /**
     * query the last record in the monthly API usage statistics table
     *
     * @return ApiStatisticsMonthlyEntity
     */
    ApiStatisticsMonthly selectLastApiUsageMonthlyRecord();

    /**
     * batch insert api usage daily statistics
     *
     * @param apiStatisticsDailyEntities apiStatisticsDailyEntities
     * @return number of execution results
     */
    int insertApiUsageDailyInfo(@Param("apiStatisticsDailyEntities") List<ApiStatisticsDaily> apiStatisticsDailyEntities);

    /**
     * batch insert api usage monthly statistics
     *
     * @param apiStatisticsMonthlyEntities apiStatisticsMonthlyEntities
     * @return number of execution results
     */
    int insertApiUsageMonthlyInfo(@Param("apiStatisticsMonthlyEntities") List<ApiStatisticsMonthly> apiStatisticsMonthlyEntities);
}
